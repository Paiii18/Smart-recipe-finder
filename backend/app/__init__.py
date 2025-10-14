import os
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
    env = os.environ.get('FLASK_ENV', 'development')
    app.config.from_object('app.config.Config')
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Disable strict slashes to prevent 308 redirects
    app.url_map.strict_slashes = False
    
    # Enable CORS - Support Vite (5173) and CRA (3000)
    # Get ngrok URLs from environment or hardcode temporarily
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    allowed_origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://smart-recipe-finder-lovat.vercel.app',  # ← Main domain
    'https://smart-recipe-finder-git-master-palii18s-projects.vercel.app',  # ← Git preview
    'https://smart-recipe-finder-fulgnev9m-palii18s-projects.vercel.app',  # ← Preview
    'https://*.vercel.app',  # ← All Vercel previews
    'https://uncut-futilely-wai.ngrok-free.dev',  # ← Ngrok
    ] 

    CORS(app, 
    origins=allowed_origins,
    supports_credentials=True,
    allow_headers=['Content-Type', 'Authorization'],
    expose_headers=['Content-Type', 'Authorization'],
    methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'error': 'Token has expired', 'message': 'Please login again'}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'error': 'Invalid token', 'message': 'Please login again'}, 401
    
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return {'error': 'Missing authorization token', 'message': 'Please login'}, 401
    
    # Import and register blueprints (routes)
    from app.routes.recipes import recipes_bp
    from app.routes.auth import auth_bp
    from app.routes.favorites import favorites_bp
    from app.routes.meal_plans import meal_plans_bp
    from app.routes.profile import profile_bp

    app.register_blueprint(recipes_bp, url_prefix='/api/recipes')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(favorites_bp, url_prefix='/api/favorites')
    app.register_blueprint(meal_plans_bp, url_prefix='/api/meal-plans')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')

    # Import models to ensure they are registered with SQLAlchemy
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
        return {'message': 'Smart Recipe Finder API is running!', 'status': 'healthy', 'environment': env}
    
    # Debug: Print registered routes
    print("\n📍 Registered Routes:")
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            print(f"  {rule.methods} {rule.rule}")
    print()
    
    return app