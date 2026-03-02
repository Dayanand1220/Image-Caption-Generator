from flask import Blueprint, request, jsonify, current_app
from ai_core.blip_model import generate_caption
from ai_core.gemini_caption import generate_gemini_caption
import base64
from bson.objectid import ObjectId
from datetime import datetime
from bson.errors import InvalidId

# Social platforms that should use Gemini refinement
SOCIAL_PLATFORMS = {"instagram", "linkedin", "twitter", "x", "facebook"}

captioning_blueprint = Blueprint('captioning', __name__)

@captioning_blueprint.route('/generate', methods=['POST'])
def generate_general_caption():
    blip_model = current_app.blip_model
    blip_processor = current_app.blip_processor
    blip_device = current_app.blip_device

    if 'image' not in request.files:
        return jsonify({"message": "No image file provided"}), 400

    image_file = request.files['image']
    tone = request.form.get('tone', 'casual')
    length = request.form.get('length', 'short')
    platform = request.form.get('platform', 'general').lower()
    ai_model_choice = request.form.get('ai_model')  # optional
    user_id = request.form.get('user_id')
    include_hashtags = request.form.get('includeHashtags', 'false').lower() == 'true'

    # Auto-decide model if not given by frontend
    if not ai_model_choice:
        if platform in SOCIAL_PLATFORMS:
            ai_model_choice = "gemini"
        else:
            ai_model_choice = "blip"

    ai_model_choice = ai_model_choice.lower()
    print(f"[DEBUG] Backend decided: AI Model = {ai_model_choice}, Platform = {platform}")

    image_bytes = image_file.read()
    final_caption = ""
    used_model = ""
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    image_url = f"data:image/jpeg;base64,{image_base64}"

    try:
        # --- BLIP LOGIC ---
        if ai_model_choice == "blip":
            # If BLIP is explicitly chosen, it MUST be for the 'general' platform.
            if platform != 'general':
                print(f"[ERROR] BLIP model selected for non-general platform: {platform}")
                return jsonify({"status": "error", "message": "BLIP model can only be used for 'General' captions. Please select 'General' platform or switch to Gemini API.", "model": "blip"}), 400
            try:
                # Pass length preference to BLIP model, tone is now fixed to casual within blip_model.py
                final_caption = generate_caption(image_bytes, blip_model, blip_processor, blip_device, length)
                used_model = "blip"
            except Exception as e:
                print(f"[ERROR] BLIP caption generation failed: {e}")
                return jsonify({"status": "error", "message": f"BLIP caption generation failed: {str(e)}", "model": "blip"}), 500

        # --- GEMINI LOGIC ---
        elif ai_model_choice == "gemini":
            try:
                final_caption = generate_gemini_caption(image_bytes, tone, length, platform, include_hashtags)
                used_model = "gemini"
                # Fallback to BLIP if Gemini returns empty text
                if not final_caption:
                    print("[WARNING] Gemini returned empty caption, attempting BLIP fallback.")
                    final_caption = generate_caption(image_bytes, blip_model, blip_processor, blip_device)
                    used_model = "blip_fallback"
            except Exception as e: # Catch any exception from Gemini
                print(f"[ERROR] Gemini caption generation failed: {e}")
                # Attempt BLIP fallback if Gemini fails entirely
                try:
                    print("[INFO] Gemini failed, attempting BLIP fallback.")
                    final_caption = generate_caption(image_bytes, blip_model, blip_processor, blip_device)
                    used_model = "blip_fallback"
                    print("[INFO] Gemini failed, successfully fell back to BLIP.")
                except Exception as blip_fallback_e:
                    print(f"[ERROR] BLIP fallback caption generation failed after Gemini error: {blip_fallback_e}")
                    return jsonify({"status": "error", "message": f"Failed to generate caption with Gemini and BLIP fallback: {str(blip_fallback_e)}", "model": "gemini"}), 500

        # --- INVALID MODEL ---
        else:
            print(f"[ERROR] Invalid AI model choice received: {ai_model_choice}")
            return jsonify({"status": "error", "message": "Invalid AI model choice.", "model": "none"}), 400

        if not final_caption:
            print(f"[ERROR] Final caption is empty after using {used_model}.")
            return jsonify({"status": "error", "message": f"Failed to generate caption: result was empty from {used_model}.", "model": used_model}), 500

        # Save to DB
        if user_id:
            try:
                mongo = current_app.mongo
                captions_collection = mongo.db.captions
                captions_collection.insert_one({
                    "user_id": user_id,
                    "caption": final_caption,
                    "platform": platform,
                    "tone": tone,
                    "length": length,
                    "image_url": image_url,
                    "model_used": used_model,
                    "createdAt": datetime.now()
                })
                print(f"[INFO] Caption saved to DB for user: {user_id} using {used_model}.")
            except Exception as db_e:
                print(f"[ERROR] Failed to save caption to database for user {user_id}: {db_e}")
        else:
            print("[WARNING] Caption not saved to DB: No user_id provided for generated caption.")

        return jsonify({
            "status": "success",
            "caption": final_caption,
            "platform": platform,
            "model": used_model,
            "image_url": image_url
        }), 200

    except Exception as e:
        print(f"[CRITICAL ERROR] Unexpected caption generation error: {e}")
        return jsonify({"status": "error", "message": f"Failed to generate caption due to unexpected server error: {str(e)}"}), 500

@captioning_blueprint.route('/user_captions/<user_id>', methods=['GET'])
def get_user_captions(user_id):
    mongo = current_app.mongo
    captions_collection = mongo.db.captions

    try:
        user_captions = list(captions_collection.find({"user_id": user_id}).sort("createdAt", -1))
        for caption in user_captions:
            caption['_id'] = str(caption['_id'])
        return jsonify({"status": "success", "captions": user_captions}), 200
    except Exception as e:
        print(f"[ERROR] Failed to fetch user captions for {user_id}: {e}")
        return jsonify({"status": "error", "message": "Failed to fetch captions."}), 500

@captioning_blueprint.route('/caption/<caption_id>', methods=['PUT'])
def update_caption(caption_id):
    mongo = current_app.mongo
    captions_collection = mongo.db.captions
    data = request.get_json()
    new_text = data.get('text')

    if not new_text:
        return jsonify({"message": "Caption text is required"}), 400

    try:
        result = captions_collection.update_one(
            {"_id": ObjectId(caption_id)},
            {"$set": {"caption": new_text, "updatedAt": datetime.now()}}
        )
        if result.modified_count == 1:
            return jsonify({"status": "success", "message": "Caption updated successfully."}), 200
        else:
            return jsonify({"status": "error", "message": "Caption not found or not modified."}), 404
    except Exception as e:
        print(f"[ERROR] Failed to update caption {caption_id}: {e}")
        return jsonify({"status": "error", "message": "Failed to update caption."}), 500

@captioning_blueprint.route('/caption/<caption_id>', methods=['DELETE'])
def delete_caption(caption_id):
    mongo = current_app.mongo
    captions_collection = mongo.db.captions

    try:
        result = captions_collection.delete_one({"_id": ObjectId(caption_id)})
        if result.deleted_count == 1:
            return jsonify({"status": "success", "message": "Caption deleted successfully."}), 200
        else:
            return jsonify({"status": "error", "message": "Caption not found."}), 404
    except InvalidId as e:
        print(f"[ERROR] Invalid caption ID format received: {caption_id}. Error: {e}")
        return jsonify({"status": "error", "message": "Invalid caption ID format."}), 400
    except Exception as e:
        print(f"[ERROR] Failed to delete caption {caption_id}: {e}")
        return jsonify({"status": "error", "message": "Failed to delete caption."}), 500