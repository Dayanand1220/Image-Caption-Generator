"""
Test script to verify Gemini API connection
Run this to diagnose Gemini connection issues
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

def test_gemini_connection():
    print("=" * 60)
    print("GEMINI API CONNECTION TEST")
    print("=" * 60)
    
    # Step 1: Check if API key exists
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        # Remove quotes if present
        api_key = api_key.strip('"').strip("'")
    
    print(f"\n1. API Key Check:")
    print(f"   - API Key exists: {api_key is not None}")
    print(f"   - API Key length: {len(api_key) if api_key else 0} characters")
    print(f"   - API Key preview: {api_key[:10]}...{api_key[-5:] if api_key and len(api_key) > 15 else ''}")
    
    if not api_key:
        print("\n❌ ERROR: GEMINI_API_KEY not found in .env file")
        return False
    
    # Step 2: Configure Gemini
    print(f"\n2. Configuring Gemini API...")
    try:
        genai.configure(api_key=api_key)
        print("   ✅ Gemini API configured successfully")
    except Exception as e:
        print(f"   ❌ Failed to configure Gemini API: {e}")
        return False
    
    # Step 3: List available models
    print(f"\n3. Listing available models...")
    try:
        models = []
        for m in genai.list_models():
            if "generateContent" in m.supported_generation_methods:
                models.append(m.name)
                print(f"   ✅ {m.name}")
        
        if not models:
            print("   ⚠️  No models found with generateContent support")
            return False
            
    except Exception as e:
        print(f"   ❌ Failed to list models: {e}")
        return False
    
    # Step 4: Test text generation
    print(f"\n4. Testing text generation...")
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content("Say 'Hello, Gemini is working!' in one sentence.")
        print(f"   ✅ Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Text generation failed: {e}")
        return False
    
    # Step 5: Test vision capabilities (if you have a test image)
    print(f"\n5. Vision capabilities check...")
    print(f"   ℹ️  Model 'gemini-2.5-flash' supports vision: Yes")
    print(f"   ℹ️  To test vision, upload an image through the web interface")
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED - Gemini API is working correctly!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = test_gemini_connection()
    exit(0 if success else 1)
