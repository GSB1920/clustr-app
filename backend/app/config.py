import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here-change-in-production'
    
    # Database - Use SQLite everywhere (simple and reliable)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'clustr.db')
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Production settings
    DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
    PORT = int(os.environ.get('PORT', 5001))
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Google OAuth Configuration - Support both Web and Android
    GOOGLE_CLIENT_ID_WEB = os.environ.get('GOOGLE_CLIENT_ID_WEB') or '13072093338-35prt0aj6VtOkepuaqekdf3donflbtro.apps.googleusercontent.com'
    GOOGLE_CLIENT_ID_ANDROID = os.environ.get('GOOGLE_CLIENT_ID_ANDROID') or '13072093338-eugco32ktmtnq2c6417i7tdh38s0mdt0.apps.googleusercontent.com'
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET') or 'GOCSPX-WhZlv7dqd25gwlPZzvQyYfW4ZQp'
    GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid_configuration"
    
    # For mobile apps, use Android client ID
    GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID_ANDROID