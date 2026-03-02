import os
from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai # Import genai here

# AI Core Imports
from ai_core.blip_model import load_blip_model
from ai_core.gemini_caption import configure_gemini

# Load environment variables
load_dotenv()

# Debugging: Print environment variables related to OAuth and URLs
print(f"[DEBUG] GOOGLE_CLIENT_ID: {os.getenv('GOOGLE_CLIENT_ID')}")
print(f"[DEBUG] GOOGLE_CLIENT_SECRET: {os.getenv('GOOGLE_CLIENT_SECRET')}")
print(f"[DEBUG] FACEBOOK_APP_ID: {os.getenv('FACEBOOK_APP_ID')}")
print(f"[DEBUG] FACEBOOK_APP_SECRET: {os.getenv('FACEBOOK_APP_SECRET')}")
print(f"[DEBUG] FRONTEND_URL: {os.getenv('FRONTEND_URL')}")
print(f"[DEBUG] BACKEND_URL: {os.getenv('BACKEND_URL')}")

# Blueprint imports
from routes.auth import auth_blueprint
from routes.captioning import captioning_blueprint

# Global BLIP variables
BLIP_MODEL = None
BLIP_PROCESSOR = None
BLIP_DEVICE = "cpu"


def create_app():
    global BLIP_MODEL, BLIP_PROCESSOR, BLIP_DEVICE

    app = Flask(__name__)
    CORS(app)

    # -------------------------------
    # 1. Load BLIP Model
    # -------------------------------
    try:
        BLIP_MODEL, BLIP_PROCESSOR, BLIP_DEVICE = load_blip_model()
        print("[INFO] BLIP model loaded successfully.")
    except Exception as e:
        print(f"[ERROR] Failed to load BLIP model: {e}")

    app.blip_model = BLIP_MODEL
    app.blip_processor = BLIP_PROCESSOR
    app.blip_device = BLIP_DEVICE

    # Temporary: List available Gemini models for debugging
    print("[DEBUG] Listing available Gemini models...")
    try:
        # Ensure API key is configured before listing models
        api_key_for_list = os.getenv("GEMINI_API_KEY")
        if api_key_for_list:
            genai.configure(api_key=api_key_for_list)
            for m in genai.list_models():
                if "generateContent" in m.supported_generation_methods:
                    print(f"[DEBUG] Available Gemini Model (supports generateContent): {m.name}")
        else:
            print("[WARNING] GEMINI_API_KEY not available for listing models.")
    except Exception as e:
        print(f"[ERROR] Failed to list Gemini models: {e}")

    # -------------------------------
    # 2. Configure Gemini API
    # -------------------------------
    if configure_gemini():
        print("[INFO] Gemini API configured successfully.")
    else:
        print("[WARNING] Gemini API not configured. Social captions may fallback to BLIP.")

    # -------------------------------
    # 3. Database Setup
    # -------------------------------
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("[WARNING] MONGO_URI not set in environment variables.")
    app.config["MONGO_URI"] = mongo_uri
    mongo = PyMongo(app)
    app.mongo = mongo

    # -------------------------------
    # 4. Register Blueprints
    # -------------------------------
    app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
    app.register_blueprint(captioning_blueprint, url_prefix='/api/caption')

    # -------------------------------
    # 5. Optional: Health Check
    # -------------------------------
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok"}), 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5123)