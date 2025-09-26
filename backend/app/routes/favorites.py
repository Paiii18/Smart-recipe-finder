from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Favorite
from app.service.recipe_service import RecipeService
from sqlalchemy.exc import IntegrityError

# Create blueprint for favorites routes
favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_favorites():
    """Get all favorite recipes for current user"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's favorites
        favorites = Favorite.query.filter_by(user_id=current_user_id).order_by(Favorite.created_at.desc()).all()
        
        return jsonify({
            'message': f'Found {len(favorites)} favorite recipes',
            'data': [fav.to_dict() for fav in favorites],
            'count': len(favorites)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get favorites'}), 500

@favorites_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_favorites():
    """Add a recipe to user's favorites"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get request data
        data = request.get_json()
        
        if not data or 'recipe_id' not in data:
            return jsonify({'error': 'Recipe ID is required'}), 400
        
        recipe_id = data['recipe_id']
        
        # Get recipe details from TheMealDB API
        service = RecipeService()
        recipe_result = service.get_recipe_by_id(recipe_id)
        
        if not recipe_result['success']:
            return jsonify({'error': 'Recipe not found or invalid'}), 404
        
        recipe_data = recipe_result['data']
        
        # Create favorite entry
        favorite = Favorite(
            user_id=current_user_id,
            recipe_id=recipe_id,
            recipe_name=recipe_data['name'],
            recipe_image=recipe_data['image']
        )
        
        # Save to database
        db.session.add(favorite)
        db.session.commit()
        
        return jsonify({
            'message': 'Recipe added to favorites successfully',
            'data': favorite.to_dict()
        }), 201
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Recipe is already in your favorites'}), 409
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add recipe to favorites'}), 500

@favorites_bp.route('/remove/<recipe_id>', methods=['DELETE'])
@jwt_required()
def remove_from_favorites(recipe_id):
    """Remove a recipe from user's favorites"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Find the favorite entry
        favorite = Favorite.query.filter_by(
            user_id=current_user_id,
            recipe_id=recipe_id
        ).first()
        
        if not favorite:
            return jsonify({'error': 'Recipe not found in favorites'}), 404
        
        # Remove from database
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({
            'message': 'Recipe removed from favorites successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to remove recipe from favorites'}), 500

@favorites_bp.route('/check/<recipe_id>', methods=['GET'])
@jwt_required()
def check_favorite_status(recipe_id):
    """Check if a recipe is in user's favorites"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Check if recipe is in favorites
        favorite = Favorite.query.filter_by(
            user_id=current_user_id,
            recipe_id=recipe_id
        ).first()
        
        is_favorite = favorite is not None
        
        return jsonify({
            'recipe_id': recipe_id,
            'is_favorite': is_favorite,
            'favorite_data': favorite.to_dict() if favorite else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to check favorite status'}), 500

@favorites_bp.route('/toggle', methods=['POST'])
@jwt_required()
def toggle_favorite():
    """Toggle favorite status of a recipe (add if not favorite, remove if favorite)"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get request data
        data = request.get_json()
        
        if not data or 'recipe_id' not in data:
            return jsonify({'error': 'Recipe ID is required'}), 400
        
        recipe_id = data['recipe_id']
        
        # Check if already in favorites
        existing_favorite = Favorite.query.filter_by(
            user_id=current_user_id,
            recipe_id=recipe_id
        ).first()
        
        if existing_favorite:
            # Remove from favorites
            db.session.delete(existing_favorite)
            db.session.commit()
            
            return jsonify({
                'message': 'Recipe removed from favorites',
                'action': 'removed',
                'is_favorite': False
            }), 200
        else:
            # Add to favorites
            # Get recipe details from API
            service = RecipeService()
            recipe_result = service.get_recipe_by_id(recipe_id)
            
            if not recipe_result['success']:
                return jsonify({'error': 'Recipe not found or invalid'}), 404
            
            recipe_data = recipe_result['data']
            
            # Create favorite entry
            favorite = Favorite(
                user_id=current_user_id,
                recipe_id=recipe_id,
                recipe_name=recipe_data['name'],
                recipe_image=recipe_data['image']
            )
            
            db.session.add(favorite)
            db.session.commit()
            
            return jsonify({
                'message': 'Recipe added to favorites',
                'action': 'added',
                'is_favorite': True,
                'data': favorite.to_dict()
            }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to toggle favorite status'}), 500

@favorites_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_favorites_stats():
    """Get user's favorites statistics"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Count favorites
        total_favorites = Favorite.query.filter_by(user_id=current_user_id).count()
        
        # Get favorites grouped by date (recent activity)
        from sqlalchemy import func
        recent_favorites = db.session.query(
            func.date(Favorite.created_at).label('date'),
            func.count(Favorite.id).label('count')
        ).filter_by(user_id=current_user_id).group_by(
            func.date(Favorite.created_at)
        ).order_by(func.date(Favorite.created_at).desc()).limit(7).all()
        
        return jsonify({
            'message': 'Favorites statistics retrieved successfully',
            'data': {
                'total_favorites': total_favorites,
                'recent_activity': [
                    {'date': str(item.date), 'count': item.count} 
                    for item in recent_favorites
                ]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get favorites statistics'}), 500