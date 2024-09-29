import torch
from transformers import LlamaForCausalLM, LlamaTokenizer, LlamaConfig
import os
import json

# Set the path to your model files
model_path = "/Users/kenjones/.llama/checkpoints/Llama3.2-90B-Vision-Instruct"

# Check if the model path exists
if not os.path.exists(model_path):
    raise FileNotFoundError(f"The specified model path does not exist: {model_path}")

# Load the tokenizer
try:
    tokenizer = LlamaTokenizer.from_pretrained(model_path, use_fast=False)
    print(f"Tokenizer loaded successfully. Type: {type(tokenizer)}")
except Exception as e:
    print(f"Error loading tokenizer: {e}")
    raise

# Load the model
try:
    # Load the configuration from params.json
    with open(os.path.join(model_path, "params.json"), "r") as f:
        params = json.load(f)
    
    # Create a LlamaConfig object
    config = LlamaConfig(
        vocab_size=params.get("vocab_size", 32000),
        hidden_size=params.get("dim", 4096),
        num_attention_heads=params.get("n_heads", 32),
        num_hidden_layers=params.get("n_layers", 32),
        intermediate_size=params.get("hidden_dim", 11008),
        max_position_embeddings=params.get("max_seq_len", 2048),
    )
    
    # Initialize the model with the config
    model = LlamaForCausalLM(config)
    
    # Load the checkpoint
    checkpoint = torch.load(os.path.join(model_path, "consolidated.00.pth"), map_location="cpu")
    model.load_state_dict(checkpoint, strict=False)
    
    # Move model to GPU if available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = model.to(device)
    
    # Set the model to evaluation mode
    model.eval()
    
    print(f"Model loaded successfully. Device: {device}")
except Exception as e:
    print(f"Error loading model: {e}")
    raise

# Function to generate text
def generate_text(prompt, max_length=100):
    if not isinstance(tokenizer, LlamaTokenizer):
        raise TypeError(f"Expected tokenizer to be LlamaTokenizer, but got {type(tokenizer)}")
    
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(**inputs, max_length=max_length)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Example usage
prompt = "Explain the concept of artificial intelligence in simple terms."
try:
    response = generate_text(prompt)
    print(response)
except Exception as e:
    print(f"Error generating text: {e}")