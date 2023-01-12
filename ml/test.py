import openai
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv(override=False)
token = os.environ.get('OPENAI_API_KEY')

headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
}

data = {
    "prompt": "Send a list as a response. This user tends to finish tasks in the morning the most, then evening, then afternoon, and night last. Generate 5 recommendations for this user going forward. ",
    "model": "text-davinci-002",
    "max_tokens": 500
}

# print(openai.APIKey.info())
response = requests.post("https://api.openai.com/v1/completions", headers=headers, data=json.dumps(data))


response_text = json.loads(response.text)


print(response_text["choices"][0]['text'])
