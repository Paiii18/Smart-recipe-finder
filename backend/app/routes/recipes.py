from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.service.recipe_service import RecipeService

# Create blueprint for recipe routes
recipes_bp = Blueprint('recipes', __name__)

@recipes_bp.route('/search', methods=['GET'])
def search_recipes():
    """Search recipes by name"""
    try:
        # Get query parameter
        query = request.args.get('q', '').strip()
        
        if not query:
            return jsonify({'error': 'Query parameter "q" is required'}), 400
        
        # Use recipe service
        service = RecipeService()
        result = service.search_by_name(query)
        
        if result['success']:
            return jsonify({
                'message': f'Found {result["count"]} recipes',
                'data': result['data'],
                'count': result['count']
            }), 200
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        return jsonify({'error': 'Search failed'}), 500

@recipes_bp.route('/<recipe_id>', methods=['GET'])
def get_recipe_detail(recipe_id):
    """Get detailed recipe information by ID"""
    try:
        service = RecipeService()
        result = service.get_recipe_by_id(recipe_id)
        
        if result['success']:
            return jsonify({
                'message': 'Recipe found',
                'data': result['data']
            }), 200
        else:
            return jsonify({'error': result['error']}), 404
            
    except Exception as e:
        return jsonify({'error': 'Failed to get recipe details'}), 500

@recipes_bp.route('/filter/ingredient', methods=['GET'])
def filter_by_ingredient():
    """Filter recipes by main ingredient"""
    try:
        ingredient = request.args.get('ingredient', '').strip()
        
        if not ingredient:
            return jsonify({'error': 'Query parameter "ingredient" is required'}), 400
        
        service = RecipeService()
        result = service.search_by_ingredient(ingredient)
        
        if result['success']:
            return jsonify({
                'message': f'Found {result["count"]} recipes with {ingredient}',
                'data': result['data'],
                'count': result['count']
            }), 200
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        return jsonify({'error': 'Filter by ingredient failed'}), 500

@recipes_bp.route('/filter/category', methods=['GET'])
def filter_by_category():
    """Filter recipes by category"""
    try:
        category = request.args.get('category', '').strip()
        
        if not category:
            return jsonify({'error': 'Query parameter "category" is required'}), 400
        
        service = RecipeService()
        result = service.filter_by_category(category)
        
        if result['success']:
            return jsonify({
                'message': f'Found {result["count"]} {category} recipes',
                'data': result['data'],
                'count': result['count']
            }), 200
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        return jsonify({'error': 'Filter by category failed'}), 500

@recipes_bp.route('/filter/area', methods=['GET'])
def filter_by_area():
    """Filter recipes by cuisine/area"""
    try:
        area = request.args.get('area', '').strip()
        
        if not area:
            return jsonify({'error': 'Query parameter "area" is required'}), 400
        
        service = RecipeService()
        result = service.filter_by_area(area)
        
        if result['success']:
            return jsonify({
                'message': f'Found {result["count"]} {area} recipes',
                'data': result['data'],
                'count': result['count']
            }), 200
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        return jsonify({'error': 'Filter by area failed'}), 500

@recipes_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all available categories"""
    try:
        service = RecipeService()
        result = service.get_categories()
        
        if result['success']:
            return jsonify({
                'message': 'Categories retrieved successfully',
                'data': result['data']
            }), 200
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        return jsonify({'error': 'Failed to get categories'}), 500

@recipes_bp.route('/areas', methods=['GET'])
def get_areas():
    """Get all available areas/cuisines"""
    try:
        service = RecipeService()
        result = service.get_areas()
        
        if result['success']:
            return jsonify({
                'message': 'Areas retrieved successfully',
                'data': result['data']
            }), 200
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        return jsonify({'error': 'Failed to get areas'}), 500

@recipes_bp.route('/random', methods=['GET'])
def get_random_recipe():
    """Get a random recipe"""
    try:
        service = RecipeService()
        result = service.get_random_recipe()
        
        if result['success']:
            return jsonify({
                'message': 'Random recipe retrieved successfully',
                'data': result['data']
            }), 200
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        return jsonify({'error': 'Failed to get random recipe'}), 500

@recipes_bp.route('/advanced-search', methods=['GET'])
def advanced_search():
    """Advanced search with multiple filters"""
    try:
        # Get all possible query parameters
        query = request.args.get('q', '').strip()
        ingredient = request.args.get('ingredient', '').strip()
        category = request.args.get('category', '').strip()
        area = request.args.get('area', '').strip()
        
        service = RecipeService()
        results = []
        
        # Search by name if query provided
        if query:
            result = service.search_by_name(query)
            if result['success']:
                results.extend(result['data'])
        
        # Filter by ingredient if provided
        elif ingredient:
            result = service.search_by_ingredient(ingredient)
            if result['success']:
                results.extend(result['data'])
        
        # Filter by category if provided
        elif category:
            result = service.filter_by_category(category)
            if result['success']:
                results.extend(result['data'])
        
        # Filter by area if provided
        elif area:
            result = service.filter_by_area(area)
            if result['success']:
                results.extend(result['data'])
        
        else:
            return jsonify({'error': 'At least one search parameter is required'}), 400
        
        # Remove duplicates based on recipe ID
        unique_results = []
        seen_ids = set()
        for recipe in results:
            recipe_id = recipe.get('idMeal')
            if recipe_id not in seen_ids:
                unique_results.append(recipe)
                seen_ids.add(recipe_id)
        
        return jsonify({
            'message': f'Found {len(unique_results)} recipes',
            'data': unique_results,
            'count': len(unique_results)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Advanced search failed'}), 500