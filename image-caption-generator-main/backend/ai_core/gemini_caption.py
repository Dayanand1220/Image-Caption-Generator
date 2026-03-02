import os
import google.generativeai as genai

def configure_gemini():
    """Configure the Gemini API using the key from environment variables."""
    api_key = os.getenv("GEMINI_API_KEY")
    # Remove quotes if present
    if api_key:
        api_key = api_key.strip('"').strip("'")
    
    print(f"[DEBUG] GEMINI_API_KEY loaded: {api_key is not None}")
    if api_key and len(api_key) > 0:
        try:
            genai.configure(api_key=api_key)
            print("[INFO] Gemini API configured successfully.")
            return True
        except Exception as e:
            print(f"[ERROR] Failed to configure Gemini API: {e}")
            return False
    print("[WARNING] GEMINI_API_KEY not found in environment variables.")
    return False


def generate_gemini_caption(image_data: bytes, tone: str, length: str, platform: str, include_hashtags: bool = False) -> str:
    """
    Generate a platform-appropriate caption using Gemini Vision.
    Platforms: instagram, linkedin, twitter/x, facebook
    """
    try:
        print(f"[DEBUG] Generating Gemini caption - Platform: {platform}, Tone: {tone}, Length: {length}, Include Hashtags: {include_hashtags}")
        
        # Using Gemini 2.5 Flash for vision capabilities
        vision_model = genai.GenerativeModel('gemini-2.5-flash')
        print("[DEBUG] Gemini model initialized successfully")

        # Platform-specific guidance with hashtag control
        if include_hashtags:
            platform_guidance = {
                "instagram": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 📸 Instagram\n\"[Caption text with emojis] #Hashtag1 #Hashtag2 #Hashtag3\"\n"
                    "Example: 📸 Instagram\n\"Chasing sunsets and dreams 🌅✨ #VibesOnly #GoldenHour #SunsetLovers\""
                ),
                "facebook": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 📘 Facebook\n\"[Caption text with emojis] #Hashtag1 #Hashtag2\"\n"
                    "Example: 📘 Facebook\n\"Good times + great friends = unforgettable memories 💙😊 #FriendshipGoals #GoodVibes\""
                ),
                "twitter": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 🐦 Twitter (X)\n\"[Caption text with emojis] #Hashtag1 #Hashtag2 #Hashtag3\"\n"
                    "Example: 🐦 Twitter (X)\n\"Small steps lead to big changes. Keep moving forward. 💪 #Motivation #DailyInspo #GrowthMindset\""
                ),
                "x": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 🐦 Twitter (X)\n\"[Caption text with emojis] #Hashtag1 #Hashtag2 #Hashtag3\"\n"
                    "Example: 🐦 Twitter (X)\n\"Small steps lead to big changes. Keep moving forward. 💪 #Motivation #DailyInspo #GrowthMindset\""
                ),
                "linkedin": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 💼 LinkedIn\n\"[Caption text with emojis] #Hashtag1 #Hashtag2 #Hashtag3\"\n"
                    "Example: 💼 LinkedIn\n\"Grateful to be learning, growing, and creating impact every day 🚀 #ProfessionalGrowth #Networking #CareerDevelopment\""
                ),
                "general": (
                    "REPLICATE THIS STRUCTURE EXACTLY: [Caption text with 3-5 relevant hashtags at the end]. "
                    "Example: 'A beautiful landscape view with mountains and a lake. #Nature #Landscape #Mountains #Photography #Scenic'"
                )
            }
        else:
            platform_guidance = {
                "instagram": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 📸 Instagram\n\"[Caption text with emojis]\"\n"
                    "Example: 📸 Instagram\n\"Chasing sunsets and dreams 🌅✨\""
                ),
                "facebook": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 📘 Facebook\n\"[Caption text with emojis]\"\n"
                    "Example: 📘 Facebook\n\"Good times + great friends = unforgettable memories 💙😊\""
                ),
                "twitter": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 🐦 Twitter (X)\n\"[Caption text with emojis]\"\n"
                    "Example: 🐦 Twitter (X)\n\"Small steps lead to big changes. Keep moving forward. 💪\""
                ),
                "x": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 🐦 Twitter (X)\n\"[Caption text with emojis]\"\n"
                    "Example: 🐦 Twitter (X)\n\"Small steps lead to big changes. Keep moving forward. 💪\""
                ),
                "linkedin": (
                    "REPLICATE THIS STRUCTURE EXACTLY: 💼 LinkedIn\n\"[Caption text with emojis]\"\n"
                    "Example: 💼 LinkedIn\n\"Grateful to be learning, growing, and creating impact every day 🚀\""
                ),
                "general": (
                    "REPLICATE THIS STRUCTURE EXACTLY: [Caption text without prefix or hashtags]. "
                    "Example: 'A beautiful landscape view with mountains and a lake.'"
                )
            }

        guidance = platform_guidance.get(platform.lower(), "REPLICATE THIS STRUCTURE EXACTLY: [Caption text without prefix or hashtags]. Example: 'A beautiful landscape view with mountains and a lake.'")

        # Length guidance
        length_guidance = {
            "short": "Keep it brief and punchy (1-2 sentences, around 10-20 words).",
            "medium": "Make it engaging and informative (2-3 sentences, around 20-40 words).",
            "long": "Create a detailed and descriptive caption (3-5 sentences, around 40-70 words)."
        }
        length_instruction = length_guidance.get(length.lower(), length_guidance["medium"])

        # Tone guidance
        tone_guidance = {
            "casual": "Use a friendly, relaxed, and conversational style.",
            "professional": "Use a polished, business-appropriate, and authoritative style.",
            "creative": "Use imaginative, artistic, and expressive language with vivid descriptions.",
            "funny": "Use humor, wit, and playful language to entertain."
        }
        tone_instruction = tone_guidance.get(tone.lower(), tone_guidance["casual"])

        # Build hashtag instruction
        hashtag_instruction = ""
        if include_hashtags:
            hashtag_instruction = "Include 3-5 relevant and trending hashtags that match the image content and platform. "
        else:
            hashtag_instruction = "Do NOT include any hashtags. "

        prompt = (
            f"You are a world-class social media caption writer. "
            f"Analyze the uploaded image and create a caption for {platform}. "
            f"\n\nTONE: {tone_instruction} "
            f"\n\nLENGTH: {length_instruction} "
            f"\n\nFORMAT: {guidance} "
            f"\n\nHASHTAGS: {hashtag_instruction}"
            f"\n\nIMPORTANT: Output ONLY the final caption text that strictly follows the specified structure. "
            f"Do NOT add any introductory text, explanations, or additional commentary. "
            f"If the format shows emojis, use 1-3 relevant emojis naturally within the text."
        )

        parts = [
            {"text": prompt},
            {"mime_type": "image/jpeg", "data": image_data}
        ]

        print("[DEBUG] Sending request to Gemini API...")
        response = vision_model.generate_content(parts)
        print("[DEBUG] Received response from Gemini API")
        
        caption = (response.text or "").strip()
        print(f"[Gemini SUCCESS] Platform: {platform} | Caption length: {len(caption)} chars")
        print(f"[Gemini] Caption preview: {caption[:100]}...")
        return caption

    except Exception as e:
        import traceback
        print(f"[ERROR] Gemini caption generation failed: {e}")
        print(f"[ERROR] Full traceback: {traceback.format_exc()}")
        return ""