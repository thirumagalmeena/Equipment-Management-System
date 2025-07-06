from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from services.auth_service import login_user # type: ignore

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({'success': False, 'message': 'Username, password, and role are required'}), 400

    success, message = login_user(username, password, role)
    return jsonify({'success': success, 'message': message})
