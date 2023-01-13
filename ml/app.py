from flask import Flask, jsonify
import json
import requests
import openai
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv(override=False)
token = os.environ.get('OPENAI_API_KEY')

headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
}

@app.route("/")
async def index():
    name = ["brian", "jackie", "ray", "tommy"]
    email = ["brian@gmail.com", "jackie@gmail.com", "ray@gmail.com", "tommy@gmail.com"]
    users = []
    for i in range(len(name)):
        user = {}
        user["username"] = name[i]
        user["email"] = email[i]
        users.append(user)
        
    return jsonify(users)


def analyzeOnTime(tasks):
    def stringify(frequency):
        string_template = "Send a list as a response. This user tends to finish tasks (in descending order):"
        frequency = frequency[::-1]
        for i in range(len(frequency)):
            string_template += f" {i+1}. {times[frequency[i]]}"
        
        #add the rest of the prompt
        string_template += " Generate 3 recommendations for this user going forward. These recommendations are for a user that is using a mobile task organization app, do not mention anything regarding the app's functionality or capabilities other than being able to create and delete tasks at scheduled times. "
        return string_template
    
    frequency = {}
    times = {
        1: "Dawn",
        2: "Morning",
        3: "Afternoon", 
        4: "Evening"
    }
    for task in tasks:
        frequency[task["time_of_day"]] = 1 + frequency.get(task["time_of_day"], 0)

    sorted_frequency = sorted(frequency.keys(), key=lambda x: frequency[x])
    prompt = stringify(sorted_frequency)
    data = {
        "prompt": prompt,
        "model": "text-davinci-003",
        "max_tokens": 500
    }
    response = requests.post("https://api.openai.com/v1/completions", headers=headers, data=json.dumps(data))
    response_text = json.loads(response.text)
    response_string = response_text["choices"][0]['text']
    recommendations = response_string.split("\n")
    recommendations = [i.split('. ')[1] for i in recommendations if i]
    #Creates an object with corresponding key names: DAWN, MORNING, AFTERNOON, NIGHT AND VALUES FROM FREQUENCY
    onTimeMetrics = {times[key]: frequency.get(key, 0) for key in times}
    print({"recommendations": recommendations, "metrics": {"onTimeMetrics": onTimeMetrics}})
    return {"recommendations": recommendations, "metrics": {"onTimeMetrics": onTimeMetrics}}
    # return recommendations


@app.post("/recommend/<user_id>")
async def predict(user_id):
    query = """
    query GetAllTasks($user_id: Int!) {
        getAllTasks(user_id: $user_id) {
            id
            completed_on_time
            time_of_day
            completed
            user_id
            category
        }
    }
    
    """
    request = requests.post('http://localhost:3000/graphql', json={'query': query, 'variables': {'user_id': int(user_id)}})
    request = json.loads(request.text)
    tasks = request["data"]["getAllTasks"]
    return analyzeOnTime(tasks)
    # 5 -> fetch()
    # graphql -> fetch(graphql/getAllTasks) -> 