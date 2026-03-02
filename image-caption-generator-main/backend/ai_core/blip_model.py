from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
import io
import base64
import os

# Define the pre-trained model name
MODEL_NAME = "Salesforce/blip-image-captioning-base"

# Initialize variables to hold the loaded model and processor
processor = None
model = None

# Gemini configuration has been moved to ai_core/gemini_caption.py

def load_blip_model():
    """Loads the BLIP model and processor into memory."""
    global processor, model
    print(f"--- Loading BLIP Model: {MODEL_NAME} ---")
    
    # Check for GPU and set device
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    # Load the processor and the model
    processor = BlipProcessor.from_pretrained(MODEL_NAME)
    model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME).to(device)
    
    print("--- BLIP Model Loaded Successfully ---")
    return model, processor, device

def generate_caption(image_data: bytes, model_obj, processor_obj, device, length_preference: str = 'medium'):
    """
    Generates a caption from raw image data, controlling length only.
    
    :param image_data: Raw bytes of the image file.
    :param model_obj: The loaded BLIP model.
    :param processor_obj: The loaded BLIP processor.
    :param device: The device ('cuda' or 'cpu').
    :param length_preference: The desired length ('short', 'medium', 'long').
    :return: The generated caption string.
    """
    
    # --- 1. Define max_length based on preference (in tokens) ---
    # These token counts are used to control the maximum length of the generated sequence.
    length_map = {
        'short': 20,   # Roughly 1-2 sentences
        'medium': 40,  # Aim for 2-3 sentences
        'long': 55,    # Aim for a detailed description, not necessarily multi-sentence
    }
    
    max_tokens = length_map.get(length_preference.lower(), 40) # Default to 'medium' value
    
    # --- 1.1 Define min_length based on preference (in tokens) ---
    min_tokens_map = {
        'short': 10,
        'medium': 20,
        'long': 30,
    }
    min_tokens = min_tokens_map.get(length_preference.lower(), 20) # Default to 'medium' value
    
    # --- 2. Simple, descriptive prompt for BLIP ---
    text_prompt = "a photo of"
    # Adjust prompt for 'long' to encourage more detail
    if length_preference.lower() == 'long':
        text_prompt = "A detailed and descriptive photo of"
    
    # 3. Open image from bytes
    raw_image = Image.open(io.BytesIO(image_data)).convert('RGB')
    
    # 4. Preprocess the image and text prompt for the model
    inputs = processor_obj(raw_image, text=text_prompt, return_tensors="pt").to(device)
    
    # 5. Generate the caption using beam search for coherence and controlled length, preventing repetition
    print(f"Generating BLIP caption with min_length={min_tokens}, max_length={max_tokens}, num_beams=6, early_stopping=True, no_repeat_ngram_size=2...")
    out = model_obj.generate(**inputs, max_length=max_tokens, min_length=min_tokens, num_beams=6, early_stopping=True, no_repeat_ngram_size=2)
    
    # 6. Decode the output token IDs to a human-readable string
    caption = processor_obj.decode(out[0], skip_special_tokens=True)
    
    # No post-processing needed as the prompt is general
    
    return caption

def generate_refined_caption(*args, **kwargs):
    raise NotImplementedError("Gemini functions moved to ai_core/gemini_caption.py")

def generate_gemini_caption(*args, **kwargs):
    raise NotImplementedError("Gemini functions moved to ai_core/gemini_caption.py")