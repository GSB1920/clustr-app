#!/bin/bash
echo "🔧 Fixing database permissions..."

cd /Users/bhanupriyaandgaurav/Desktop/Assignment/clustr-app/backend

# Fix database permissions
chmod 664 app/clustr.db
chmod 755 app/

echo "✅ Database permissions fixed"
echo "🚀 Restart your Flask server with: python run.py"
