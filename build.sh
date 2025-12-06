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
