import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from store.models import Product

# Borrar productos existentes
Product.objects.all().delete()

products_data = [
    # LAPTOPS Y COMPUTADORES
    {'name': 'Laptop HP Pavilion 15', 'description': 'Intel Core i5 11va Gen, 8GB RAM, 256GB SSD, Pantalla 15.6" Full HD', 'price': 549990, 'stock': 15},
    {'name': 'MacBook Air M2', 'description': 'Chip M2, 8GB RAM, 256GB SSD, Pantalla Retina 13.6", Color Gris Espacial', 'price': 1299990, 'stock': 8},
    {'name': 'Laptop Lenovo IdeaPad', 'description': 'AMD Ryzen 5, 12GB RAM, 512GB SSD, Pantalla 14" FHD, Windows 11', 'price': 599990, 'stock': 12},
    {'name': 'Dell Inspiron 15', 'description': 'Intel Core i7, 16GB RAM, 512GB SSD, NVIDIA GeForce MX450, Pantalla 15.6"', 'price': 899990, 'stock': 10},
    {'name': 'ASUS TUF Gaming', 'description': 'Intel Core i7, 16GB RAM, RTX 3050, 512GB SSD, Pantalla 15.6" 144Hz', 'price': 1199990, 'stock': 6},
    {'name': 'Laptop Acer Aspire 5', 'description': 'Intel Core i3, 8GB RAM, 256GB SSD, Pantalla 15.6", Ideal para estudio', 'price': 449990, 'stock': 20},
    
    # PERIFÉRICOS
    {'name': 'Mouse Logitech MX Master 3', 'description': 'Inalámbrico, Ergonómico, 7 botones programables, Batería de 70 días', 'price': 89990, 'stock': 50},
    {'name': 'Teclado Mecánico Redragon', 'description': 'Switches Blue, RGB, Cable USB-C, Español, Ideal para gaming', 'price': 69990, 'stock': 35},
    {'name': 'Mouse Gamer Razer DeathAdder', 'description': '20000 DPI, RGB Chroma, 8 botones programables, Cable trenzado', 'price': 59990, 'stock': 40},
    {'name': 'Teclado Logitech K380', 'description': 'Inalámbrico, Bluetooth, Multi-dispositivo, Compacto, Batería 2 años', 'price': 39990, 'stock': 60},
    {'name': 'Combo Teclado + Mouse Logitech', 'description': 'Inalámbrico, Receptor USB unificado, Diseño ergonómico', 'price': 49990, 'stock': 45},
    
    # MONITORES
    {'name': 'Monitor Samsung 24" Full HD', 'description': 'Panel IPS, 75Hz, FreeSync, HDMI, Bisel delgado, Ideal oficina', 'price': 149990, 'stock': 25},
    {'name': 'Monitor LG UltraWide 29"', 'description': '29" 21:9, Full HD, IPS, HDR10, 75Hz, Ideal productividad', 'price': 299990, 'stock': 12},
    {'name': 'Monitor Gamer ASUS 27"', 'description': '27" QHD, 165Hz, 1ms, G-Sync, Panel IVA, Perfecto para gaming', 'price': 399990, 'stock': 8},
    {'name': 'Monitor Dell 24" 4K', 'description': '24" Ultra HD, IPS, USB-C, 99% sRGB, Ideal diseñadores', 'price': 449990, 'stock': 10},
    
    # ALMACENAMIENTO
    {'name': 'SSD Kingston 1TB NVMe', 'description': 'M.2 NVMe PCIe 3.0, Lectura 2100MB/s, Ideal para laptops y PC', 'price': 89990, 'stock': 30},
    {'name': 'Disco Duro Externo 2TB', 'description': 'USB 3.0, Portátil, Compatible Windows/Mac, Color Negro', 'price': 79990, 'stock': 40},
    {'name': 'SSD Samsung 500GB', 'description': 'SATA 2.5", 560MB/s lectura, Incluye software de clonación', 'price': 59990, 'stock': 35},
    {'name': 'Pendrive 128GB USB 3.2', 'description': 'Alta velocidad, Compacto, Metal, Ideal para archivos grandes', 'price': 19990, 'stock': 100},
    
    # AUDIO
    {'name': 'Audífonos Sony WH-1000XM5', 'description': 'Cancelación ruido activa, Bluetooth, 30hrs batería, Hi-Res Audio', 'price': 349990, 'stock': 15},
    {'name': 'Audífonos Gamer HyperX Cloud', 'description': 'Sonido 7.1, Micrófono extraíble, Almohadillas memory foam, USB', 'price': 79990, 'stock': 25},
    {'name': 'Parlante JBL Flip 6', 'description': 'Bluetooth, IPX7 resistente al agua, 12hrs batería, Sonido potente', 'price': 129990, 'stock': 20},
    {'name': 'Micrófono Blue Yeti', 'description': 'USB, Condensador, 4 patrones, Ideal streaming y podcasts', 'price': 159990, 'stock': 12},
    
    # CÁMARAS Y VIDEO
    {'name': 'Webcam Logitech C920', 'description': 'Full HD 1080p, 30fps, Micrófono estéreo, Ideal videollamadas', 'price': 79990, 'stock': 30},
    {'name': 'Webcam 4K Razer Kiyo Pro', 'description': '4K 30fps, Sensor adaptativo, HDR, Ideal streaming profesional', 'price': 199990, 'stock': 10},
    
    # GAMING
    {'name': 'Consola PlayStation 5', 'description': 'PS5 Digital Edition, 825GB SSD, Ray Tracing, 4K 120fps', 'price': 549990, 'stock': 5},
    {'name': 'Control Xbox Series X', 'description': 'Inalámbrico, Bluetooth, Textura antideslizante, Batería 40hrs', 'price': 69990, 'stock': 40},
    {'name': 'Silla Gamer RGB', 'description': 'Ergonómica, Respaldo reclinable 180°, Reposabrazos 4D, Cojines lumbar', 'price': 249990, 'stock': 15},
    
    # ACCESORIOS
    {'name': 'Hub USB-C 7 en 1', 'description': 'HDMI 4K, 3x USB 3.0, SD/microSD, USB-C PD 100W, Aluminio', 'price': 39990, 'stock': 50},
    {'name': 'Cable HDMI 2.1 3 metros', 'description': '8K 60Hz, 4K 120Hz, eARC, Trenzado, Alta velocidad', 'price': 19990, 'stock': 80},
]

print('🔥 Creando 30 productos...')
for data in products_data:
    product = Product.objects.create(**data)
    print(f'  ✅ Creado: {product.name} - ')

print(f'\\n✅ Total: {Product.objects.count()} productos creados')
print(f'💰 Precio promedio: ')
