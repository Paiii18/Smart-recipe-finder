#!/usr/bin/env python3
"""
Debug registration issues
Save as: backend/debug_registration.py
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app import create_app, db
from app.models import User

def debug_registration():
    """Debug registration process"""
    
    app = create_app()
    
    with app.app_context():
        print("🔍 Debugging Registration Process...")
        print("=" * 50)
        
        try:
            # Check if database tables exist
            print("\n1. Checking database tables...")
            db.create_all()
            print("✅ Database tables created/verified")
            
            # Check existing users
            print("\n2. Checking existing users...")
            existing_users = User.query.all()
            print(f"✅ Found {len(existing_users)} existing users")
            for user in existing_users:
                print(f"   - {user.username} ({user.email})")
            
            # Try to create a test user
            print("\n3. Testing user creation...")
            test_username = "debuguser"
            test_email = "debug@test.com"
            test_password = "123456"
            
            # Check if test user already exists
            existing_test_user = User.query.filter(
                (User.username == test_username) | (User.email == test_email)
            ).first()
            
            if existing_test_user:
                print(f"⚠️  Test user already exists: {existing_test_user.username}")
                # Delete test user for clean test
                db.session.delete(existing_test_user)
                db.session.commit()
                print("✅ Deleted existing test user")
            
            # Create new test user
            test_user = User(
                username=test_username,
                email=test_email,
                password=test_password
            )
            
            db.session.add(test_user)
            db.session.commit()
            print("✅ Test user created successfully!")
            print(f"   User ID: {test_user.id}")
            print(f"   Username: {test_user.username}")
            print(f"   Email: {test_user.email}")
            
            # Test password verification
            print("\n4. Testing password verification...")
            if test_user.check_password(test_password):
                print("✅ Password verification works")
            else:
                print("❌ Password verification failed")
            
            # Test token generation
            print("\n5. Testing token generation...")
            tokens = test_user.generate_tokens()
            if tokens and 'access_token' in tokens:
                print("✅ Token generation works")
                print(f"   Access token: {tokens['access_token'][:50]}...")
            else:
                print("❌ Token generation failed")
            
            print("\n" + "=" * 50)
            print("🎉 Registration debugging completed!")
            
        except Exception as e:
            print(f"❌ Debug failed: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    debug_registration()