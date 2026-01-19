#!/usr/bin/env python3
"""
Test script to isolate startup issues
"""
import os
from dotenv import load_dotenv

print("=== Testing Backend Startup ===")

# Load environment variables
load_dotenv()
print("✓ Environment variables loaded")

# Test imports
try:
    import flask
    print("✓ Flask import OK")
except ImportError as e:
    print(f"✗ Flask import failed: {e}")

try:
    import google.generativeai as genai
    print("✓ Gemini import OK")
except ImportError as e:
    print(f"✗ Gemini import failed: {e}")

try:
    from transformers import BlipProcessor, BlipForConditionalGeneration
    print("✓ BLIP imports OK")
except ImportError as e:
    print(f"✗ BLIP import failed: {e}")

# Test environment variables
gemini_key = os.getenv("GEMINI_API_KEY")
mongo_uri = os.getenv("MONGO_URI")

print(f"GEMINI_API_KEY: {'✓ Set' if gemini_key and gemini_key != 'your_actual_gemini_api_key_here' else '✗ Not set or placeholder'}")
print(f"MONGO_URI: {'✓ Set' if mongo_uri and mongo_uri != 'mongodb://localhost:27017/image_caption_db' else '✗ Using default/placeholder'}")

# Test Gemini API (if key is set)
if gemini_key and gemini_key != 'your_actual_gemini_api_key_here':
    try:
        genai.configure(api_key=gemini_key)
        models = list(genai.list_models())
        print(f"✓ Gemini API connection OK ({len(models)} models available)")
    except Exception as e:
        print(f"✗ Gemini API connection failed: {e}")
else:
    print("⚠ Skipping Gemini API test (no valid key)")

print("\n=== Startup Test Complete ===")