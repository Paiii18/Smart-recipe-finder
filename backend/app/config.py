import os
from datetime import timedelta

class Config:
    """Configuration class for Flask application"""

    #Dasar konfigurasi Flask
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-this-in-production'

    #Konfigurasi Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///recipe_finder.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False #Nonaktifkan sistem ke penyimpanan memori

    #Konfigurasi JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-this-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    #Eksternal Konfigurasi API
    THEMEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

    #Pengaturan Aplikasi
    DEBUG = True
    TESTING = False

    #Pengaturan CORS
    CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']

class DevelopmentConfig(Config):
    """Development-specific-configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev_recipe_finder.db'

class ProductionConfig(Config):
    """Production-specific configuration"""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEU')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

class TestingConfig(Config):
    """Testing-specific configuration"""
    TESTING= True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False