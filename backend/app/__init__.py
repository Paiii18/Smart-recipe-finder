from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

#Inisiasi extenstions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    """Aplication factory pattern for creating Flask app"""

    #Membuat Flask Instance
    app = Flask(__name__)

    #memuat konfig
    app.config.from_object('app.config.Config')

    #inisiasi ekstensi dengan app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    CORS(app, origins=['http:localhost:3000'])

    #import dan pendaftaran blueprint (routes)
    from app.routes.recipes import recipes_bp
    from app.routes.auth import auth_bp
    from app.routes.favorite import favorites_bp

    app.register_blueprint(recipes_bp, url_prefix='/api/recipes')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(favorites_bp, url_prefix='/api/favorites')

    #import model untuk memastikan terdaftar di SQLAlchemy
    from app import models

    #membuat tabel database
    with app.app_context():
        db.create_all() 


    #dasar cek route 
    @app.route('/')
    def health_check():
        return {'message': 'Smart Recipe Finder API is running!','status':'healthy'}
    
    return app