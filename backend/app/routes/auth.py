from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from app import db
from app.models import User
from sqlalchemy.exc import IntegrityError

#Create blueprint for auth routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        #Get JSON data from request
        data = request.get_json()

        #validate required fields
        if not data or not all(k in data for k in ('username','email','password')):
            return jsonify({'error':'Missing required fields: username, email, password'}), 400
        
        username = data['username'].strip()
        email = data['data'].strip().lower()
        password = data['password']

        #Validasi dasar
        if len(username) < 3:
            return jsonify({'error': 'Username must be at least 3 characters long'}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 character long'}), 400
        
        if '@' not in email:
            return jsonify({'error': 'Invalid email format'}), 400
        
        #Membuat user baru
        user = User(username=username, email=email, password=password)

        #menyimpan ke database
        db.session.add(user)
        db.session.commit()

        #membuat token
        tokens = user.generate_tokens()

        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'access_token': tokens['access_token'],
            'refresh_token': tokens['refresh_token']
        }), 201
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Username or email already exists'}), 409
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500
    
@auth_bp.route('/login', methods=['POST'])
def login():
    """Login User"""
    try:
        #mendapatkan data JSON dari permintaan
        data = request.get_json()

        #validasi bidang yang wajib diisi
        if not data or not all(k in data for k in ('username_or_email','password')):
            return jsonify({'error': 'Missing username/email and password'}), 400
        
        username_or_email = data['username_or_email'].strip()
        password = data['password']

        #mencari user berdasarkan username atau password
        user = User.query.filter(
            (User.username == username_or_email) |
            (User.email == username_or_email.lower())
        ).first()

        #cek apakah user sudah ada dan password benar
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid username/email or password'}), 401
        
        #membuat token
        tokens = user.generate_tokens()

        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': tokens['access_token'],
            'refresh_token': tokens['refresh_token']
        }), 200
    
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500
    
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    try:
        #Dapatkan ID pengguna saat ini dari token refresh
        current_user_id = get_jwt_identity()

        #Membuat akses token baru
        new_access_token = create_access_token(identity=current_user_id)

        return jsonify({
            'access_token': new_access_token
        }), 200
    
    except Exception as e:
        return jsonify({'error': 'Token refresh failed'}), 500
    
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        #Dapatkan ID pengguna saat ini dari token
        current_user_id = get_jwt_identity()

        #cari user
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user':  user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': 'Failed to get profile'}), 500
    
@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """verify if token is valid"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 400
        
        return jsonify({
            'message': 'Token is valid',
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': 'Token verification failed'}), 500
