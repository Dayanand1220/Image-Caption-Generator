#!/usr/bin/env python3
"""
Minimal version of the app that works without external API keys
"""
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import io
from PIL import Image

# Load environment variables
load_dotenv()

def create_minimal_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "message": "Backend is running!"}), 200

    @app.route('/api/caption/generate', methods=['POST'])
    def generate_caption_minimal():
        """Minimal caption generation without AI models"""
        
        if 'image' not in request.files:
            return jsonify({"message": "No image file provided"}), 400

        image_file = request.files['image']
        tone = request.form.get('tone', 'casual')
        length = request.form.get('length', 'medium')
        platform = request.form.get('platform', 'general')
        
        # Simple mock caption based on preferences
        mock_captions = {
            'short': f"A beautiful image perfect for {platform}! 📸",
            'medium': f"This amazing photo captures a wonderful moment. Great for sharing on {platform} with a {tone} vibe! ✨",
            'long': f"What an incredible image! This photo tells a story and would be perfect for {platform}. The {tone} tone really comes through, making it ideal for engaging your audience. Don't forget to share this masterpiece! 🌟📱"
        }
        
        caption = mock_captions.get(length, mock_captions['medium'])
        
        return jsonify({
            "status": "success",
            "caption": caption,
            "platform": platform,
            "model": "mock",
            "message": "This is a demo caption. Configure GEMINI_API_KEY for AI-generated captions."
        }), 200

    return app

if __name__ == "__main__":
    app = create_minimal_app()
    print("🚀 Starting minimal backend server...")
    print("📝 This version works without API keys - perfect for testing!")
    print("🔗 Backend will be available at: http://localhost:5123")
    app.run(debug=True, port=5123, host='0.0.0.0')