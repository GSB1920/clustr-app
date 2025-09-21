from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime
import uuid
import re

class User(db.Model):
    __tablename__ = 'users'
    
    # Primary fields matching your ERD
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=True, index=True)
    avatar_url = db.Column(db.String(500), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    interests = db.Column(db.JSON, default=list)  # Array of text interests
    role = db.Column(db.String(20), default='user')  # user, moderator, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Authentication fields
    password_hash = db.Column(db.String(255), nullable=True)  # Null for OAuth users
    
    # OAuth fields (for future implementation)
    oauth_provider = db.Column(db.String(50), nullable=True)  # 'google', 'facebook', etc.
    oauth_id = db.Column(db.String(100), nullable=True)
    
    # Account status
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime)
    
    def set_password(self, password):
        """Hash and set password for email/password authentication"""
        if password:
            self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)
    
    def generate_token(self, expires_delta=None):
        """Generate JWT token for user"""
        additional_claims = {
            "email": self.email,
            "username": self.username,
            "role": self.role
        }
        return create_access_token(
            identity=self.id, 
            additional_claims=additional_claims,
            expires_delta=expires_delta
        )
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary for JSON response"""
        data = {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'avatar_url': self.avatar_url,
            'bio': self.bio,
            'interests': self.interests or [],
            'role': self.role,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'auth_method': 'oauth' if self.oauth_provider else 'email'
        }
        
        if include_sensitive:
            data.update({
                'oauth_provider': self.oauth_provider,
                'is_active': self.is_active,
                'last_login': self.last_login.isoformat() if self.last_login else None
            })
        
        return data
    
    @staticmethod
    def is_valid_email(email):
        """Validate email format"""
        if not email:
            return False
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def generate_username_from_email(email):
        """Generate a unique username from email"""
        base_username = email.split('@')[0]
        base_username = re.sub(r'[^a-zA-Z0-9_]', '_', base_username)
        
        # Check if username exists, if so add number suffix
        counter = 1
        username = base_username
        while User.query.filter_by(username=username).first():
            username = f"{base_username}_{counter}"
            counter += 1
        
        return username
    
    def __repr__(self):
        return f'<User {self.email}>'

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Primary category
    tags = db.Column(db.JSON, default=list)  # Multiple categories/tags
    location = db.Column(db.String(500), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False)
    max_attendees = db.Column(db.Integer, nullable=False)
    attendees = db.Column(db.JSON, default=list)  # Array of user IDs
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'tags': self.tags or [],
            'location': self.location,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'max_attendees': self.max_attendees,
            'attendees': self.attendees or [],
            'attendee_count': len(self.attendees) if self.attendees else 0,
            'spots_left': self.max_attendees - (len(self.attendees) if self.attendees else 0),
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }