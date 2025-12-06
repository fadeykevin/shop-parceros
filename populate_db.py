import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from store.models import Product

products_data = [
    {'name': 'Laptop HP', 'description': 'Laptop HP 15.6 pulgadas', 'price': 599.99, 'stock': 10},
    {'name': 'Mouse Logitech', 'description': 'Mouse inalámbrico', 'price': 29.99, 'stock': 50},
    {'name': 'Teclado Mecánico', 'description': 'Teclado RGB', 'price': 89.99, 'stock': 30},
    {'name': 'Monitor Samsung', 'description': 'Monitor 24 pulgadas', 'price': 199.99, 'stock': 15},
    {'name': 'Webcam HD', 'description': 'Cámara web 1080p', 'price': 49.99, 'stock': 25},
]

print('🔥 Creando productos...')
for data in products_data:
    product, created = Product.objects.get_or_create(name=data['name'], defaults=data)
    print(f'  {"✅ Creado" if created else "⚠️  Ya existe"}: {product.name}')

print(f'\\n✅ Total: {Product.objects.count()} productos')
