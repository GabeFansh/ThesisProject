from flask import Flask, jsonify, request, make_response, session
from flask_cors import CORS
import json

from flask_session.__init__ import Session

app = Flask(__name__)
app.config['SESSION_PERMANENT'] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})


@app.route('/')
def hello():
    username = session['username'] if 'username' in session else None
    print(username)
    print(f'Cookie received: {username}')  # Log the username cookie
    response = {
        'message': 'Hello' + (f', {username}' if username else '') + '!'
    }
    return jsonify(response)


@app.route('/start')
def start():
    return jsonify({'message': 'Start the game!'})


@app.route('/login', methods=['POST'])
def login():
    data = request.json

    if 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Invalid input', 'success': False}), 400

    username = data['username']
    password = data['password']

    session['username'] = username


    print(f'Login: {username} - Password: {password}')  # Log the login attempt

    with open('accounts.json', 'r') as f:
        accounts = json.load(f)
        if username in accounts:
            if accounts[username] != password:
                return jsonify({'message': 'Invalid password', 'success': False}), 401
        else:
            accounts[username] = password
            with open('accounts.json', 'w') as f:
                json.dump(accounts, f)



    response = make_response(jsonify({'message': 'Login successful!', 'success': True, 'username': username}))
    print(f'Setting cookie for username: {username}')  # Debugging line

    # Set the cookie for the username (set secure=False for local testing)
    response.set_cookie('username', username, samesite='None', secure=False, httponly=True, max_age=60*60*24*7)



    return response


@app.route('/set-cookie')
def set_cookie():
    response = make_response(jsonify({'message': 'Cookie is set!'}))
    response.set_cookie('test_cookie', 'test_value', samesite='None', secure=False)  # Adjust based on environment
    return response

@app.route('/logout')
def logout():
    response = make_response(jsonify({'message': 'Logged out!'}))
    response.set_cookie('username', '', expires=0)
    return response


if __name__ == '__main__':
    app.run(debug=True)
