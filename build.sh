#!/usr/bin/env bash
set -o errexit

echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "📁 Creating directories..."
mkdir -p staticfiles media

echo "🗄️ Running migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input

echo "🎨 Collecting static files..."
python manage.py collectstatic --no-input --clear

echo "👤 Creating superuser..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@shop.com', 'admin123')
END

echo "🛍️ Creating sample products..."
python manage.py create_products

echo "✅ Build completed"
