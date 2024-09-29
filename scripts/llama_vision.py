from transformers import AutoTokenizer, AutoModelForCausalLM, AutoProcessor
import torch
import os
from PIL import Image
import requests

# Replace with the specific model repository name
model_name = "meta-llama/Llama-3.2-11B-Vision-Instruct"

# Optional: Set Hugging Face token if not using CLI login
# os.environ["HUGGINGFACE_HUB_TOKEN"] = "your_access_token_here"

# Load processor
processor = AutoProcessor.from_pretrained(model_name)

# Determine device and set appropriate dtype for Apple Silicon
if torch.backends.mps.is_available():
    device = "mps"
    torch_dtype = torch.float16
    torch.set_float32_matmul_precision('high')  # Optimize matrix multiplications for MPS
elif torch.cuda.is_available():
    device = "cuda"
    torch_dtype = torch.float16
else:
    device = "cpu"
    torch_dtype = torch.float32

# Load model with appropriate device settings
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch_dtype,
    device_map="auto"  # Automatically map model layers to available devices
)

model.eval()  # Set model to evaluation mode for inference

# Add a loop for continuous interaction
while True:
    # Prompt for user input
    input_text = input("Enter your prompt (or 'quit' to exit): ")
    
    # Check if the user wants to quit
    if input_text.lower() == 'quit':
        break

    # Prompt for image input
    image_input = input("Enter the image path or URL (or press Enter to skip): ")

    # Prepare inputs
    image = None
    if image_input:
        if os.path.isfile(image_input):
            # Load local image file
            try:
                image = Image.open(image_input)
                print(f"Successfully loaded image: {image_input}")
                print(f"Image size: {image.size}")
                print(f"Image mode: {image.mode}")
            except IOError as e:
                print(f"Error: Unable to open image file '{image_input}'. Error: {str(e)}")
        elif image_input.startswith(('http://', 'https://')):
            # Load image from URL
            try:
                image = Image.open(requests.get(image_input, stream=True).raw)
                print(f"Successfully loaded image from URL: {image_input}")
                print(f"Image size: {image.size}")
                print(f"Image mode: {image.mode}")
            except Exception as e:
                print(f"Error: Unable to load image from URL '{image_input}'. Error: {str(e)}")
        else:
            print(f"Error: Invalid image input '{image_input}'. Skipping image.")

    try:
        if image:
            # Ensure the image is in RGB mode
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Modify the input format
            inputs = processor(
                text=[input_text],  # Wrap the text in a list
                images=[image],     # Wrap the image in a list
                return_tensors="pt"
            )
            print("Successfully processed image and text inputs.")
        else:
            inputs = processor(text=[input_text], return_tensors="pt")  # Wrap the text in a list
            print("Processed text input without image.")

        # Move inputs to the correct device
        inputs = {k: v.to(device) for k, v in inputs.items()}

        # Generate response
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=500,  # Increased max_new_tokens for longer responses
                do_sample=True,
                temperature=0.7
            )

        # Decode and print
        prompt_len = inputs['input_ids'].shape[-1]
        generated_ids = outputs[:, prompt_len:]
        response = processor.batch_decode(generated_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]
        print("\nModel's response:")
        print(response)
        print()  # Add a blank line for readability
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("Please try again with a different input.")

print("Goodbye!")