#!/usr/bin/env python3
"""
Setup script for chat database tables
Run this after adding chat models to create the new tables
"""

from app import create_app, db
from app.models import ChatRoom, Message

def setup_chat_tables():
    """Create chat-related database tables"""
    app = create_app()
    
    with app.app_context():
        try:
            # Create all tables (will only create new ones)
            db.create_all()
            
            print("✅ Chat database tables created successfully!")
            print("📋 New tables:")
            print("  - chat_rooms (for event chat rooms)")
            print("  - messages (for chat messages)")
            
            # Verify tables exist
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            if 'chat_rooms' in tables and 'messages' in tables:
                print("🔍 Verification: Chat tables exist in database")
            else:
                print("⚠️  Warning: Chat tables may not have been created")
                
        except Exception as e:
            print(f"❌ Error setting up chat tables: {e}")
            raise

if __name__ == "__main__":
    setup_chat_tables()
