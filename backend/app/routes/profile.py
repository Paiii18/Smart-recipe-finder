from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Favorite, MealPlan
from sqlalchemy.exc import IntegrityError

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile with statistics"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get statistics
        favorites_count = Favorite.query.filter_by(user_id=user_id).count()
        meal_plans_count = MealPlan.query.filter_by(user_id=user_id).count()
        
        # Get upcoming meal plans
        from datetime import date
        upcoming_meals = MealPlan.query.filter(
            MealPlan.user_id == user_id,
            MealPlan.planned_date >= date.today()
        ).order_by(MealPlan.planned_date).limit(5).all()
        
        return jsonify({
            'success': True,
            'profile': {
                **user.to_dict(),
                'statistics': {
                    'favorites_count': favorites_count,
                    'meal_plans_count': meal_plans_count,
                    'upcoming_meals_count': len(upcoming_meals)
                },
                'upcoming_meals': [meal.to_dict() for meal in upcoming_meals]
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile (username, email)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update username if provided
        if 'username' in data:
            username = data['username'].strip()
            if len(username) < 3:
                return jsonify({
                    'success': False,
                    'error': 'Username must be at least 3 characters long'
                }), 400
            
            # Check if username already exists (excluding current user)
            existing = User.query.filter(
                User.username == username,
                User.id != user_id
            ).first()
            
            if existing:
                return jsonify({
                    'success': False,
                    'error': 'Username already taken'
                }), 409
            
            user.username = username
        
        # Update email if provided
        if 'email' in data:
            email = data['email'].strip().lower()
            if '@' not in email:
                return jsonify({
                    'success': False,
                    'error': 'Invalid email format'
                }), 400
            
            # Check if email already exists (excluding current user)
            existing = User.query.filter(
                User.email == email,
                User.id != user_id
            ).first()
            
            if existing:
                return jsonify({
                    'success': False,
                    'error': 'Email already taken'
                }), 409
            
            user.email = email
        
        # Update timestamp
        from datetime import datetime
        user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Username or email already exists'
        }), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@profile_bp.route('/password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('current_password', 'new_password')):
            return jsonify({
                'success': False,
                'error': 'Missing required fields: current_password, new_password'
            }), 400
        
        current_password = data['current_password']
        new_password = data['new_password']
        
        # Verify current password
        if not user.check_password(current_password):
            return jsonify({
                'success': False,
                'error': 'Current password is incorrect'
            }), 401
        
        # Validate new password
        if len(new_password) < 6:
            return jsonify({
                'success': False,
                'error': 'New password must be at least 6 characters long'
            }), 400
        
        # Update password
        user.set_password(new_password)
        
        # Update timestamp
        from datetime import datetime
        user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@profile_bp.route('', methods=['DELETE'])
@jwt_required()
def delete_account():
    """Delete user account"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json() or {}
        password = data.get('password')
        
        # Require password confirmation
        if not password or not user.check_password(password):
            return jsonify({
                'success': False,
                'error': 'Password confirmation required'
            }), 401
        
        # Delete user (cascade will delete favorites and meal plans)
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Account deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500