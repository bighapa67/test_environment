import requests
import json

url = "http://localhost:11434/api/chat"

def llama3(prompt):
    data = {
        "model": "llama3",
        "messages": [
            {
                "role": "user",
                "content": prompt

            }
        ],
        "stream": False,
    }

    headers = {
        "Content-Type": "application/json"
    }

# def llama32_vision_90b(prompt):
#     data = {
#         "model": "llama3.2-90B-Vision-Instruct",
#         "messages": [
#             {
#                 "role": "user",
#                 "content": prompt

#             }
#         ],
#         "stream": False,
#     }

#     headers = {
#         "Content-Type": "application/json"
#     }

    response = requests.post(url, headers=headers, json=data)
    return response.json()["message"]["content"]
