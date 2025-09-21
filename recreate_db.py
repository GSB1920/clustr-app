#!/usr/bin/env python3
"""
Simple script to recreate the database if permissions are stuck
"""
import os
import sys

# Add the backend directory to the path
backend_dir = '/Users/bhanupriyaandgaurav/Desktop/Assignment/clustr-app/backend'
sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

try:
    from app import create_app, db
    
    print("🔧 Recreating database...")
    
    # Remove old database if it exists
    db_path = os.path.join(backend_dir, 'app', 'clustr.db')
    if os.path.exists(db_path):
        os.remove(db_path)
        print("🗑️ Old database removed")
    
    # Create new database
    app = create_app()
    with app.app_context():
        db.create_all()
        print("✅ New database created successfully")
        print("🚀 You can now restart Flask with: python run.py")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("💡 Try manually deleting app/clustr.db and restarting Flask")
