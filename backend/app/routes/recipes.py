from flask import Blueprint

recipes_bp = Blueprint('recipes', __name__)

@recipes_bp.route('/test')
def test():
    return {'message': 'Recipes routes working'}