#!/usr/bin/env bash
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

# Crear directorio de estáticos si no existe
mkdir -p staticfiles

# Collectstatic sin validación
python manage.py collectstatic --no-input --clear
