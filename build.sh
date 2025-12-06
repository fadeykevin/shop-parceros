#!/usr/bin/env bash
set -o errexit

echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "📁 Creating directories..."
mkdir -p staticfiles media

echo "🗄️ FORCE migrations for store app..."
python manage.py makemigrations store --no-input
python manage.py migrate --no-input

echo "🎨 Collecting static files..."
python manage.py collectstatic --no-input --clear

echo "🛍️ Creating sample products..."
python manage.py create_products || echo "⚠️ create_products failed, continuing..."

echo "✅ Build completed"
