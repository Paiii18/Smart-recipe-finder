from flask import Blueprint

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/test')
def test():
    return {'message': 'Favorites routes working'}