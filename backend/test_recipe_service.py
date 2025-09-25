#!/usr/bin/env python3
"""
Simple test script for Recipe Service
Save this as: backend/test_recipe_service.py
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app import create_app
from app.service.recipe_service import RecipeService

def test_recipe_service():
    """Test Recipe Service methods"""
    
    # Create Flask app context (needed for config access)
    app = create_app()
    
    with app.app_context():
        print("🧪 Testing Recipe Service...")
        print("=" * 50)
        
        # Initialize service
        service = RecipeService()
        
        # Test 1: Search by name
        print("\n📝 Test 1: Search by name 'chicken'")
        result = service.search_by_name('chicken')
        if result['success']:
            print(f"✅ Found {result['count']} recipes")
            if result['data']:
                first_recipe = result['data'][0]
                print(f"   First recipe: {first_recipe.get('strMeal', 'N/A')}")
        else:
            print(f"❌ Error: {result['error']}")
        
        # Test 2: Get categories
        print("\n📝 Test 2: Get categories")
        result = service.get_categories()
        if result['success']:
            categories = [cat.get('strCategory') for cat in result['data'][:5]]
            print(f"✅ Found categories: {', '.join(categories)}...")
        else:
            print(f"❌ Error: {result['error']}")
        
        # Test 3: Get random recipe
        print("\n📝 Test 3: Get random recipe")
        result = service.get_random_recipe()
        if result['success']:
            recipe = result['data']
            print(f"✅ Random recipe: {recipe['name']}")
            print(f"   Category: {recipe['category']}")
            print(f"   Area: {recipe['area']}")
            print(f"   Ingredients count: {len(recipe['ingredients'])}")
        else:
            print(f"❌ Error: {result['error']}")
        
        # Test 4: Search by ingredient
        print("\n📝 Test 4: Search by ingredient 'chicken'")
        result = service.search_by_ingredient('chicken')
        if result['success']:
            print(f"✅ Found {result['count']} recipes with chicken")
        else:
            print(f"❌ Error: {result['error']}")
        
        # Test 5: Filter by category
        print("\n📝 Test 5: Filter by category 'Dessert'")
        result = service.filter_by_category('Dessert')
        if result['success']:
            print(f"✅ Found {result['count']} dessert recipes")
        else:
            print(f"❌ Error: {result['error']}")
        
        print("\n" + "=" * 50)
        print("🎉 Recipe Service test completed!")

if __name__ == '__main__':
    try:
        test_recipe_service()
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()