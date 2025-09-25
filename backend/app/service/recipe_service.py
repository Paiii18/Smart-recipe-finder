import requests
from flask import current_app

class RecipeService:
    """Service class for interacting with TheMealDB API"""
    
    def __init__(self):
        self.base_url = current_app.config['THEMEALDB_BASE_URL']

    def search_by_name(self, query):
        """Search recipes by name"""
        try: 
            url = f"{self.base_url}/search.php"
            params = {'s': query}
            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()
            return {
                'success': True,
                'data': data.get('meals', []),
                'count': len(data.get('meals',[]))
            }
        except requests.exceptions.RequestException as e:
            return {
                'succes': False,
                'error': f'API request failed: {str(e)}',
                'data': []
            }
        
    def get_recipe_by_id(self, recipe_id):
        """Get detailed recipe information by ID"""
        try:
            url = f"{self.base_url}/lookup.php"
            params = {'i': recipe_id}
            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()
            meals = data.get('meals', [])

            if not meals:
                return {
                    'success': False,
                    'error': 'Recipe not found',
                    'data': None   
                }
            
            #proses data resetp agar frontend-friendly
            recipe = self._process_recipe_data(meals[0])

            return {
                'success': True,
                'data': recipe
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error' : f'API request failed : {str(e)}',
                'data': None            
            }
        
    def search_by_ingredient(self, ingredient):
        """Search recipes by main ingredient"""
        try:
            url = f"{self.base_url}/filter.php"
            params = {'i': ingredient}
            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()
            return { 
                'success': True,
                'data': data.get('meals', []),
                'count': len(data.get('meals',[]))
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'API request failed: {str(e)}',
                'data': [],
            }
        
    def filter_by_category(self, category):
        """filter recipes by category"""
        try:
            url = f"{self.base_url}/filter.php"
            params = {'c': category}
            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()
            return {
                'success': True,
                'data': data.get('meals',[]),
                'count': len(data.get('meals',[]))
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'API request failed: {str(e)}',
                'data': [],
            }
        
    def filter_by_area(self, area):
        """Filter recipes by area"""
        try:
            url = f"{self.base_url}/filter.php"
            params = {'a': area}
            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()
            return {
                'success': True,
                'data': data.get('meals',[]),
                'count': len(data.get('meals',[]))
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'API request failed: {str(e)}',
                'data': [],
            }    
        
    def get_categories(self):
        """Get all available categories"""
        try:
            url = f"{self.base_url}/categories.php"
            response = requests.get(url)
            response.raise_for_status()

            data = response.json()
            return {
                'success': True,
                'data': data.get('categories',[])
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'API request failed: {str(e)}',
                'data': [],
            }
        
    def get_area(self):
        """Get all available area"""
        try:
            url = f"{self.base_url}/list.php"
            params = {'a': list}
            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()
            return {
                'success': True,
                'data': data.get('meals',[])
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'API request failed: {str(e)}',
                'data': [],
            }
        
    def get_random_recipe(self):
        """Get a random recipe"""
        try:
            url = f"{self.base_url}/random.php"
            response = requests.get(url)
            response.raise_for_status()
            
            data = response.json()
            meals = data.get('meals', [])
            
            if not meals:
                return {
                    'success': False,
                    'error': 'No random recipe found',
                    'data': None
                }
            
            recipe = self._process_recipe_data(meals[0])
            
            return {
                'success': True,
                'data': recipe
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'API request failed: {str(e)}',
                'data': None
            }
    
    def _process_recipe_data(self, raw_recipe):
        """Process raw recipe data from API to make it more structured"""
        # Extract ingredients and measurements
        ingredients = []
        for i in range(1, 21):  # TheMealDB has up to 20 ingredients
            ingredient = raw_recipe.get(f'strIngredient{i}', '').strip()
            measure = raw_recipe.get(f'strMeasure{i}', '').strip()
            
            if ingredient and ingredient.lower() != 'null':
                ingredients.append({
                    'ingredient': ingredient,
                    'measure': measure if measure and measure.lower() != 'null' else ''
                })
        
        # Return structured recipe data
        return {
            'id': raw_recipe.get('idMeal'),
            'name': raw_recipe.get('strMeal'),
            'category': raw_recipe.get('strCategory'),
            'area': raw_recipe.get('strArea'),
            'instructions': raw_recipe.get('strInstructions'),
            'image': raw_recipe.get('strMealThumb'),
            'tags': raw_recipe.get('strTags', '').split(',') if raw_recipe.get('strTags') else [],
            'youtube': raw_recipe.get('strYoutube'),
            'ingredients': ingredients,
            'source': raw_recipe.get('strSource')
        }
    