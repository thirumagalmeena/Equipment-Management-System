from flask import Blueprint, request, jsonify
from ..services.csv_service import load_users

login_blueprint = Blueprint('login', __name__)

@login_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if role == "administrator":
        csv_file = 'data/admin.csv'
    elif role == "employee":
        csv_file = 'data/employee.csv'
    else:
        return jsonify({'success': False, 'message': 'Invalid role selected'}), 400

    users = load_users(csv_file)

    for user in users:
        if user['username'] == username and user['password'] == password:
            return jsonify({'success': True, 'message': f'Welcome {role} {username}!'})
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

