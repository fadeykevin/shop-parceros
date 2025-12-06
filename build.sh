#!/usr/bin/env bash
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

# Crear directorios necesarios
mkdir -p staticfiles
mkdir -p media

# Collect static files
python manage.py collectstatic --no-input --clear

# Run migrations
python manage.py migrate --no-input

# Create superuser if it doesn't exist
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@shop.com', 'admin123')" | python manage.py shell

# Load initial data if exists
if [ -f "tienda/fixtures/initial_data.json" ]; then
    python manage.py loaddata tienda/fixtures/initial_data.json
fi
