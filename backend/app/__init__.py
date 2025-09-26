from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    """Application factory pattern for creating Flask app"""
    
    # Create Flask instance
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('app.config.Config')
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Enable CORS for all routes (allow frontend to call API)
    CORS(app, origins=['http://localhost:3000'])  # React dev server
    
    # Import and register blueprints (routes)
    from app.routes.recipes import recipes_bp
    from app.routes.auth import auth_bp
    from app.routes.favorites import favorites_bp
    
    app.register_blueprint(recipes_bp, url_prefix='/api/recipes')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(favorites_bp, url_prefix='/api/favorites')
    
    # Import models to ensure they are registered with SQLAlchemy
    from app import models
    
    # Import models first to ensure they are registered
    from app import models
    
    # Create database tables
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created successfully")
        except Exception as e:
            print(f"❌ Database creation error: {e}")
    
    # Basic health check route
    @app.route('/')
    def health_check():
        return {'message': 'Smart Recipe Finder API is running!', 'status': 'healthy'}
    
    return app