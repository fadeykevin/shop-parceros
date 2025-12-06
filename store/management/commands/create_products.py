from django.core.management.base import BaseCommand
from store.models import Product

class Command(BaseCommand):
    help = 'Crear productos de prueba'
    
    def handle(self, *args, **kwargs):
        productos = [
            {
                'name': 'iPhone 15 Pro',
                'description': 'Último modelo de Apple con chip A17 Pro',
                'price': 999990,
                'stock': 10,
                'active': True
            },
            {
                'name': 'Samsung Galaxy S24 Ultra',
                'description': 'Smartphone premium con S Pen incluido',
                'price': 849990,
                'stock': 15,
                'active': True
            },
            {
                'name': 'MacBook Air M2',
                'description': 'Laptop ultradelgada y potente',
                'price': 1299990,
                'stock': 5,
                'active': True
            },
            {
                'name': 'AirPods Pro 2',
                'description': 'Auriculares con cancelación de ruido activa',
                'price': 249990,
                'stock': 20,
                'active': True
            },
            {
                'name': 'Sony PlayStation 5',
                'description': 'Consola de videojuegos de última generación',
                'price': 599990,
                'stock': 8,
                'active': True
            }
        ]
        
        created_count = 0
        for prod_data in productos:
            product, created = Product.objects.get_or_create(
                name=prod_data['name'],
                defaults=prod_data
            )
            if created:
                created_count += 1
                self.stdout.write(f'✅ Creado: {product.name}')
            else:
                self.stdout.write(f'⏭️  Ya existe: {product.name}')
        
        self.stdout.write(self.style.SUCCESS(f'\n🎉 Proceso completado: {created_count} productos nuevos'))
