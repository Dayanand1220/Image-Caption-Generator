#!/usr/bin/env python3
"""
Production version for Railway deployment
Simplified without heavy AI dependencies
"""
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS for production
    CORS(app, origins=[
        "http://localhost:3000",  # Local development
        "https://*.vercel.app",   # Vercel deployments
        "https://dayanand1220.github.io"  # GitHub Pages
    ])

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "message": "🤖 AI Image Caption Generator API", 
            "status": "running",
            "version": "1.0.0"
        }), 200

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "message": "Backend is running!"}), 200

    @app.route('/api/caption/generate', methods=['POST'])
    def generate_caption():
        """Simple caption generation for production"""
        
        if 'image' not in request.files:
            return jsonify({"message": "No image file provided"}), 400

        image_file = request.files['image']
        tone = request.form.get('tone', 'casual')
        length = request.form.get('length', 'medium')
        platform = request.form.get('platform', 'general')
        ai_model = request.form.get('ai_model', 'demo')
        
        # Demo captions based on preferences
        demo_captions = {
            ('short', 'casual'): f"Perfect shot for {platform}! 📸✨",
            ('short', 'professional'): f"Excellent visual content for {platform}.",
            ('short', 'creative'): f"Art meets {platform} magic! 🎨",
            ('short', 'funny'): f"When {platform} meets awesome! 😄",
            
            ('medium', 'casual'): f"This amazing photo is perfect for sharing on {platform}! The composition really captures the moment beautifully. 📸✨",
            ('medium', 'professional'): f"High-quality visual content optimized for {platform}. This image demonstrates excellent composition and would engage your target audience effectively.",
            ('medium', 'creative'): f"Where creativity meets {platform}! This captivating image tells a story that resonates with viewers and sparks imagination. 🎨✨",
            ('medium', 'funny'): f"When your {platform} game is stronger than your coffee! ☕ This photo is giving main character energy and we're here for it! 😄",
            
            ('long', 'casual'): f"Wow, what an incredible shot! This photo is absolutely perfect for {platform} and really captures something special. The lighting, composition, and overall vibe are just amazing. Your followers are going to love this content - it's exactly the kind of authentic, engaging post that performs well on {platform}. Can't wait to see the engagement this gets! 📸✨🔥",
            ('long', 'professional'): f"This exceptional visual content is strategically crafted for optimal {platform} engagement. The composition demonstrates professional photography principles while maintaining platform-appropriate aesthetics. This type of high-quality imagery aligns perfectly with current {platform} algorithm preferences and is likely to achieve strong organic reach and meaningful audience interaction.",
            ('long', 'creative'): f"Step into a world where imagination meets {platform} perfection! This mesmerizing image weaves a tapestry of visual storytelling that transcends ordinary social media content. Every pixel dances with creative energy, inviting viewers on a journey of discovery and wonder. It's not just a photo - it's a portal to inspiration that will captivate your {platform} audience! 🎨✨🌟",
            ('long', 'funny'): f"Breaking news: Local human posts absolutely legendary content on {platform}! 📰 This photo is serving looks, serving vibes, and serving 'how did they even capture this perfection?' energy. Your camera roll could never! This is the kind of content that makes people stop scrolling, double-tap immediately, and then slide into your DMs asking for photography tips. Iconic behavior, honestly! 😄📸🔥"
        }
        
        # Get appropriate caption
        caption_key = (length, tone)
        caption = demo_captions.get(caption_key, f"Beautiful image perfect for {platform}! 📸")
        
        # Add hashtags if requested
        include_hashtags = request.form.get('includeHashtags', 'false').lower() == 'true'
        if include_hashtags:
            hashtag_sets = {
                'instagram': '#Photography #InstaGood #PhotoOfTheDay #Beautiful #Art',
                'twitter': '#Photo #Content #Creative #Share #Viral',
                'facebook': '#Photography #Social #Content #Beautiful #Share',
                'linkedin': '#Professional #Content #Photography #Business #Quality',
                'general': '#Photo #Beautiful #Content #Creative #Share'
            }
            hashtags = hashtag_sets.get(platform, hashtag_sets['general'])
            caption += f"\n\n{hashtags}"
        
        return jsonify({
            "status": "success",
            "caption": caption,
            "platform": platform,
            "model": "demo",
            "message": "Demo caption generated! Add GEMINI_API_KEY for AI-powered captions."
        }), 200

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5123))
    print(f"🚀 Starting production backend on port {port}...")
    print("📝 This is a demo version - add API keys for full AI features!")
    app.run(host='0.0.0.0', port=port, debug=False)