from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models import User
from datetime import datetime, timedelta
import re
from app.utils.google_oauth import GoogleOAuth

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def validate_password(password):
    """Validate password strength"""
    if not password:
        return False, "Password is required"
    
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    return True, None

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Register new user with email and password"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract and validate data
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        username = data.get('username', '').strip()
        
        # Validation
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        if not User.is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        is_valid_password, password_error = validate_password(password)
        if not is_valid_password:
            return jsonify({'error': password_error}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Generate username if not provided
        if not username:
            username = User.generate_username_from_email(email)
        else:
            # Check if username is already taken
            if User.query.filter_by(username=username).first():
                return jsonify({'error': 'Username already taken'}), 409
        
        # Create new user
        user = User(
            email=email,
            username=username,
            interests=data.get('interests', [])
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generate token
        token = user.generate_token(expires_delta=timedelta(days=30))
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Signup error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user with email and password"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'No account found with this email. Please sign up first.'}), 404
        
        # Check if user used OAuth to register
        if user.oauth_provider and not user.password_hash:
            return jsonify({
                'error': f'Please login with {user.oauth_provider.title()}',
                'oauth_provider': user.oauth_provider
            }), 401
        
        if not user.check_password(password):
            return jsonify({'error': 'Incorrect password. Please try again.'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate token
        token = user.generate_token(expires_delta=timedelta(days=30))
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        print(f"Get user error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client should remove token)"""
    # With JWT, logout is typically handled on the frontend by removing the token
    # For enhanced security, you could implement token blacklisting here
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')
        
        if not current_password or not new_password:
            return jsonify({'error': 'Current and new passwords are required'}), 400
        
        # Check current password
        if not user.check_password(current_password):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        is_valid, error_msg = validate_password(new_password)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Update password
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Change password error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/google', methods=['POST'])
def google_oauth():
    """
    Handle Google OAuth authentication
    Expects: { "token": "google_id_token_or_access_token", "token_type": "id_token" or "access_token" }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        token = data.get('token')
        token_type = data.get('token_type', 'id_token')
        
        if not token:
            return jsonify({'error': 'Google token is required'}), 400
        
        # Verify Google token and get user info
        if token_type == 'id_token':
            google_user_info = GoogleOAuth.verify_google_token(token)
        else:
            google_user_info = GoogleOAuth.get_user_info_from_token(token)
        
        if not google_user_info:
            return jsonify({'error': 'Invalid Google token'}), 401
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=google_user_info['email']).first()
        
        if existing_user:
            # User exists - update OAuth info if needed and login
            if not existing_user.oauth_provider:
                # User signed up with email/password, now linking Google
                existing_user.oauth_provider = 'google'
                existing_user.oauth_id = google_user_info['google_id']
                existing_user.avatar_url = google_user_info.get('picture', existing_user.avatar_url)
                db.session.commit()
            
            # Update last login
            existing_user.last_login = datetime.utcnow()
            db.session.commit()
            
            # Generate token
            token = existing_user.generate_token(expires_delta=timedelta(days=30))
            
            return jsonify({
                'message': 'Google login successful',
                'token': token,
                'user': existing_user.to_dict()
            }), 200
        
        else:
            # New user - create account with Google info
            # Generate username from email or name
            username = User.generate_username_from_email(google_user_info['email'])
            
            user = User(
                email=google_user_info['email'],
                username=username,
                oauth_provider='google',
                oauth_id=google_user_info['google_id'],
                avatar_url=google_user_info.get('picture'),
                is_verified=google_user_info.get('email_verified', False)
            )
            
            # Set name fields if available
            if google_user_info.get('first_name') or google_user_info.get('last_name'):
                # We'll need to add these fields to the User model, or store in a name field
                pass
            
            db.session.add(user)
            db.session.commit()
            
            # Generate token
            token = user.generate_token(expires_delta=timedelta(days=30))
            
            return jsonify({
                'message': 'Google account created successfully',
                'token': token,
                'user': user.to_dict()
            }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Google OAuth error: {str(e)}")
        return jsonify({'error': 'Google authentication failed'}), 500

@auth_bp.route('/google/config', methods=['GET'])
def google_config():
    """
    Get Google OAuth configuration for frontend
    """
    return jsonify({
        'google_client_id': current_app.config['GOOGLE_CLIENT_ID_WEB']  # Return WEB client ID
    }), 200