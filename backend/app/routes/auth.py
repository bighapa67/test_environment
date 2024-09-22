from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from ..models.user import User
from .. import db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400
    
    new_user = User(username=username, password=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User created successfully"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and check_password_hash(user.password, password):
        # Here you would typically create and return a JWT token
        return jsonify({"message": "Login successful"}), 200
    
    return jsonify({"message": "Invalid credentials"}), 401