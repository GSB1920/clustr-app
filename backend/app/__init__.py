from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
socketio = SocketIO()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('app.config.Config')
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")
    migrate.init_app(app, db)
    
    # Configure CORS for React Native
    CORS(app, 
         origins=["*"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # Import models
    from app import models
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.events import events_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(events_bp)
    
    # Register a basic health check route
    @app.route('/')
    def health_check():
        return {'message': 'Clustr Backend is running!', 'status': 'healthy'}
    
    return app