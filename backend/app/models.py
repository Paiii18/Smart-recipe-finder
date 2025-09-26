from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token

class User(db.Model):
    """User model for authentication and user management"""
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    favorites = db.relationship('Favorite', backref='user', lazy=True, cascade='all, delete-orphan')
    meal_plans = db.relationship('MealPlan', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def generate_tokens(self):
        """Generate access and refresh tokens for user"""
        # Convert user ID to string for JWT subject
        access_token = create_access_token(identity=str(self.id))
        refresh_token = create_refresh_token(identity=str(self.id))
        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }
    
    def to_dict(self):
        """Convert user object to dictionary (for JSON response)"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'favorites_count': len(self.favorites)
        }
    
    def __repr__(self):
        return f'<User {self.username}>'

class Favorite(db.Model):
    """Favorite recipes model"""
    
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipe_id = db.Column(db.String(50), nullable=False)  # TheMealDB recipe ID
    recipe_name = db.Column(db.String(200), nullable=False)
    recipe_image = db.Column(db.String(500))  # URL to recipe image
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint: one user cannot favorite same recipe twice
    __table_args__ = (db.UniqueConstraint('user_id', 'recipe_id', name='unique_user_recipe'),)
    
    def to_dict(self):
        """Convert favorite object to dictionary"""
        return {
            'id': self.id,
            'recipe_id': self.recipe_id,
            'recipe_name': self.recipe_name,
            'recipe_image': self.recipe_image,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Favorite {self.recipe_name} by User {self.user_id}>'

class MealPlan(db.Model):
    """Meal planning model"""
    
    __tablename__ = 'meal_plans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipe_id = db.Column(db.String(50), nullable=False)
    recipe_name = db.Column(db.String(200), nullable=False)
    recipe_image = db.Column(db.String(500))
    planned_date = db.Column(db.Date, nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)  # breakfast, lunch, dinner
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert meal plan object to dictionary"""
        return {
            'id': self.id,
            'recipe_id': self.recipe_id,
            'recipe_name': self.recipe_name,
            'recipe_image': self.recipe_image,
            'planned_date': self.planned_date.isoformat(),
            'meal_type': self.meal_type,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<MealPlan {self.recipe_name} for {self.planned_date}>'