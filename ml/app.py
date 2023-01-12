from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    name = ["brian", "jackie", "ray", "tommy"]
    email = ["brian@gmail.com", "jackie@gmail.com", "ray@gmail.com", "tommy@gmail.com"]
    users = []
    for i in range(len(name)):
        user = {}
        user["username"] = name[i]
        user["email"] = email[i]
        users.append(user)
        
    return jsonify(users)


@app.route("/predict")
def predict():
    return "<h1>ML Prediction</h1>"