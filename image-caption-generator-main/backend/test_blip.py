#!/usr/bin/env python3
"""
Test script for BLIP model caption generation
"""

import requests
import os
from PIL import Image
import io

def test_blip_captioning():
    """Test the BLIP captioning API endpoint"""
    
    # Create a simple test image
    test_image = Image.new('RGB', (224, 224), color='red')
    
    # Convert to bytes
    img_byte_arr = io.BytesIO()
    test_image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    
    # Test the API endpoint
    url = 'http://localhost:5123/api/caption/general'
    
    try:
        files = {'image': ('test.png', img_byte_arr, 'image/png')}
        response = requests.post(url, files=files)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ BLIP Caption Generation Test PASSED!")
            print(f"Generated Caption: {result.get('caption', 'No caption')}")
            return True
        else:
            print(f"❌ Test failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the backend is running on port 5123")
        return False
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing BLIP Model Caption Generation...")
    test_blip_captioning()
