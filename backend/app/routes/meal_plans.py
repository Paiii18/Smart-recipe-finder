from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, MealPlan
from datetime import datetime, date
from sqlalchemy.exc import IntegrityError

# Create blueprint for meal plans routes
meal_plans_bp = Blueprint('meal_plans', __name__)

@meal_plans_bp.route('/', methods=['GET'])
@jwt_required()
def get_meal_plans():
    """Get meal plans for current user with optional date filters"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Build query
        query = MealPlan.query.filter_by(user_id=current_user_id)
        
        # Apply date filters if provided
        if start_date:
            query = query.filter(MealPlan.planned_date >= start_date)
        if end_date:
            query = query.filter(MealPlan.planned_date <= end_date)
        
        # Order by date and meal type
        meal_plans = query.order_by(MealPlan.planned_date, MealPlan.meal_type).all()
        
        return jsonify([plan.to_dict() for plan in meal_plans]), 200
        
    except Exception as e:
        print(f"Error getting meal plans: {str(e)}")
        return jsonify({'error': 'Failed to get meal plans'}), 500

@meal_plans_bp.route('/', methods=['POST'])
@jwt_required()
def add_meal_plan():
    """Add a meal plan"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['recipe_id', 'recipe_name', 'planned_date', 'meal_type']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate meal_type
        valid_meal_types = ['breakfast', 'lunch', 'dinner']
        if data['meal_type'].lower() not in valid_meal_types:
            return jsonify({'error': 'Invalid meal type. Must be breakfast, lunch, or dinner'}), 400
        
        # Parse date
        try:
            planned_date = datetime.strptime(data['planned_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Create meal plan
        meal_plan = MealPlan(
            user_id=current_user_id,
            recipe_id=data['recipe_id'],
            recipe_name=data['recipe_name'],
            recipe_image=data.get('recipe_image'),
            planned_date=planned_date,
            meal_type=data['meal_type'].lower()
        )
        
        db.session.add(meal_plan)
        db.session.commit()
        
        return jsonify({
            'message': 'Meal plan added successfully',
            'data': meal_plan.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error adding meal plan: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to add meal plan'}), 500

@meal_plans_bp.route('/<int:plan_id>', methods=['PUT'])
@jwt_required()
def update_meal_plan(plan_id):
    """Update a meal plan"""
    try:
        current_user_id = get_jwt_identity()
        
        # Find meal plan
        meal_plan = MealPlan.query.filter_by(id=plan_id, user_id=current_user_id).first()
        
        if not meal_plan:
            return jsonify({'error': 'Meal plan not found'}), 404
        
        data = request.get_json()
        
        # Update fields if provided
        if 'planned_date' in data:
            try:
                meal_plan.planned_date = datetime.strptime(data['planned_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        if 'meal_type' in data:
            valid_meal_types = ['breakfast', 'lunch', 'dinner']
            if data['meal_type'].lower() not in valid_meal_types:
                return jsonify({'error': 'Invalid meal type'}), 400
            meal_plan.meal_type = data['meal_type'].lower()
        
        if 'recipe_id' in data:
            meal_plan.recipe_id = data['recipe_id']
        if 'recipe_name' in data:
            meal_plan.recipe_name = data['recipe_name']
        if 'recipe_image' in data:
            meal_plan.recipe_image = data['recipe_image']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Meal plan updated successfully',
            'data': meal_plan.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating meal plan: {str(e)}")
        return jsonify({'error': 'Failed to update meal plan'}), 500

@meal_plans_bp.route('/<int:plan_id>', methods=['DELETE'])
@jwt_required()
def delete_meal_plan(plan_id):
    """Delete a meal plan"""
    try:
        current_user_id = get_jwt_identity()
        
        # Find meal plan
        meal_plan = MealPlan.query.filter_by(id=plan_id, user_id=current_user_id).first()
        
        if not meal_plan:
            return jsonify({'error': 'Meal plan not found'}), 404
        
        db.session.delete(meal_plan)
        db.session.commit()
        
        return jsonify({'message': 'Meal plan deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting meal plan: {str(e)}")
        return jsonify({'error': 'Failed to delete meal plan'}), 500

@meal_plans_bp.route('/date/<date_str>', methods=['GET'])
@jwt_required()
def get_meal_plans_by_date(date_str):
    """Get all meal plans for a specific date"""
    try:
        current_user_id = get_jwt_identity()
        
        # Parse date
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        meal_plans = MealPlan.query.filter_by(
            user_id=current_user_id,
            planned_date=target_date
        ).order_by(MealPlan.meal_type).all()
        
        return jsonify([plan.to_dict() for plan in meal_plans]), 200
        
    except Exception as e:
        print(f"Error getting meal plans by date: {str(e)}")
        return jsonify({'error': 'Failed to get meal plans'}), 500