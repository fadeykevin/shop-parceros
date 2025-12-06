from django.core.management.base import BaseCommand
from tienda.models import Product, Category

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        # Crear categoría
        cat, _ = Category.objects.get_or_create(
            name='Electrónica',
            defaults={'description': 'Productos tecnológicos'}
        )
        
        # Crear productos de prueba
        productos = [
            {
                'name': 'iPhone 15 Pro',
                'description': 'Último modelo de Apple',
                'price': 999990,
                'stock': 10,
                'category': cat
            },
            {
                'name': 'Samsung Galaxy S24',
                'description': 'Smartphone premium Samsung',
                'price': 849990,
                'stock': 15,
                'category': cat
            },
            {
                'name': 'MacBook Air M2',
                'description': 'Laptop ultradelgada',
                'price': 1299990,
                'stock': 5,
                'category': cat
            }
        ]
        
        for prod in productos:
            Product.objects.get_or_create(
                name=prod['name'],
                defaults=prod
            )
        
        self.stdout.write('Productos creados exitosamente')
