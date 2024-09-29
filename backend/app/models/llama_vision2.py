from PIL import Image
import requests
import os
# from transformers import AutoProcessor, MllamaForConditionalGeneration

# Load model directly
from transformers import AutoProcessor, AutoModelForPreTraining

processor = AutoProcessor.from_pretrained("meta-llama/Llama-3.2-11B-Vision-Instruct")
model = AutoModelForPreTraining.from_pretrained("meta-llama/Llama-3.2-11B-Vision-Instruct")

# checkpoint = "meta-llama/Llama-3.2-11B-Vision"
# model = MllamaForConditionalGeneration.from_pretrained(checkpoint)
# processor = AutoProcessor.from_pretrained(checkpoint)

# prompt = "<|image|>Describe this image in detail."
# prompt = input("Enter your prompt: ")

def load_image(image_source):
    if image_source.startswith(('http://', 'https://')):
        # Load image from URL
        return Image.open(requests.get(image_source, stream=True).raw)
    elif os.path.isfile(image_source):
        # Load local image file
        return Image.open(image_source)
    else:
        raise ValueError("Invalid image source. Please provide a valid URL or local file path.")

def generate_response(prompt, image):
    inputs = processor(text=prompt, images=image, return_tensors="pt")
    output = model.generate(**inputs, max_new_tokens=100)
    prompt_len = inputs.input_ids.shape[-1]
    generated_ids = output[:, prompt_len:]
    return processor.batch_decode(generated_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]

print("Welcome to the AI Image Conversation System!")
# prompt = input("Enter your prompt: ")
image_source = input("Enter the image URL or local file path: ")

try:
    image = load_image(image_source)
    print("Image loaded successfully. You can now start the conversation.")
    print("Type 'quit' to end the conversation.")

    while True:
        user_prompt = input("You: ")
        if user_prompt.lower() == 'quit':
            print("Ending conversation. Goodbye!")
            break

        full_prompt = f"<|image|>{user_prompt}"
        response = generate_response(full_prompt, image)
        print(f"AI: {response}")

except ValueError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")