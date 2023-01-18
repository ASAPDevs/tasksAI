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
    "prompt": "Send a list as a response. This user tends to finish tasks in the morning the most, then evening, then afternoon, and night last. Generate 5 recommendations for this user going forward. These recommendations are for a user that is using a mobile task organization app, do not mention anything regarding the app's functionality or capabilities other than being able to create and delete tasks at scheduled times. ",
    "model": "text-davinci-003",
    "max_tokens": 500
}


# print(openai.APIKey.info())
response = requests.post("https://api.openai.com/v1/completions", headers=headers, data=json.dumps(data))


response_text = json.loads(response.text)


print(response_text["choices"][0]['text'])
