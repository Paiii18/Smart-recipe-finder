#!/usr/bin/env python3
"""
Test JWT token functionality
Save as: backend/test_jwt.py
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app import create_app
from app.models import User
from flask_jwt_extended import decode_token
import jwt

def test_jwt_functionality():
    """Test JWT token creation and validation"""
    
    app = create_app()
    
    with app.app_context():
        print("🔍 Testing JWT Functionality...")
        print("=" * 50)
        
        try:
            # Get a user (should exist from previous tests)
            user = User.query.first()
            if not user:
                print("❌ No users found. Please register a user first.")
                return
                
            print(f"✅ Found user: {user.username}")
            
            # Generate tokens
            print("\n1. Testing token generation...")
            tokens = user.generate_tokens()
            access_token = tokens['access_token']
            
            print(f"✅ Token generated successfully")
            print(f"   Token: {access_token[:50]}...")
            
            # Try to decode token manually
            print("\n2. Testing token decoding...")
            try:
                # Get JWT secret from config
                jwt_secret = app.config['JWT_SECRET_KEY']
                decoded = jwt.decode(access_token, jwt_secret, algorithms=['HS256'])
                print("✅ Token decoded successfully")
                print(f"   Subject (user_id): {decoded['sub']}")
                print(f"   Type: {decoded['type']}")
                
            except Exception as e:
                print(f"❌ Token decode failed: {e}")
            
            # Test with Flask-JWT-Extended
            print("\n3. Testing with Flask-JWT-Extended...")
            try:
                decoded_jwt = decode_token(access_token)
                print("✅ Flask-JWT-Extended decode successful")
                print(f"   Identity: {decoded_jwt['sub']}")
            except Exception as e:
                print(f"❌ Flask-JWT-Extended decode failed: {e}")
            
            print(f"\n4. Token for testing:")
            print(f"Authorization: Bearer {access_token}")
            
        except Exception as e:
            print(f"❌ JWT test failed: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    test_jwt_functionality()