# 🛒 Shop Parceros - E-commerce API REST

E-commerce completo desarrollado con Django REST Framework, incluyendo CI/CD, pruebas automatizadas y métricas de rendimiento.

## 🚀 Características

- ✅ API REST completa con Django REST Framework
- ✅ Autenticación JWT (JSON Web Tokens)
- ✅ CRUD de productos
- ✅ Sistema de carrito de compras
- ✅ Gestión de pedidos
- ✅ Documentación Swagger/OpenAPI
- ✅ CI/CD con GitHub Actions
- ✅ Pruebas unitarias automatizadas
- ✅ Pruebas de carga con Locust
- ✅ Debug toolbar para desarrollo

## 🛠️ Tecnologías Utilizadas

- **Backend:** Django 5.1, Django REST Framework
- **Autenticación:** SimpleJWT
- **Base de datos:** SQLite (desarrollo)
- **Documentación:** drf-yasg (Swagger)
- **Testing:** Django Test Framework, Locust
- **CI/CD:** GitHub Actions
- **Servidor:** Django Development Server

## 📋 Requisitos Previos

- Python 3.11+
- pip
- virtualenv (recomendado)

## 🔧 Instalación

\\\ash
# Clonar repositorio
git clone https://github.com/fadeykevin/shop-parceros.git
cd shop-parceros

# Crear entorno virtual
python -m venv venv
venv\\Scripts\\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Poblar base de datos (opcional)
python populate_db.py

# Ejecutar servidor
python manage.py runserver
\\\

## 🌐 Endpoints Principales

### Autenticación
- \POST /api/auth/register/\ - Registro de usuario
- \POST /api/auth/login/\ - Login (obtener token JWT)
- \POST /api/auth/token/refresh/\ - Refrescar token

### Productos
- \GET /api/products/\ - Listar productos
- \POST /api/products/\ - Crear producto (admin)
- \GET /api/products/{id}/\ - Detalle de producto
- \PUT /api/products/{id}/\ - Actualizar producto (admin)
- \DELETE /api/products/{id}/\ - Eliminar producto (admin)

### Carrito
- \GET /api/cart/\ - Ver carrito (autenticado)
- \POST /api/cart/add/\ - Agregar al carrito
- \DELETE /api/cart/remove/{id}/\ - Quitar del carrito

### Pedidos
- \POST /api/orders/create/\ - Crear pedido
- \GET /api/orders/\ - Listar mis pedidos

### Documentación
- \/swagger/\ - Documentación interactiva Swagger
- \/admin/\ - Panel de administración Django

## 🧪 Pruebas

### Ejecutar tests unitarios
\\\ash
python manage.py test
\\\

### Ejecutar pruebas de carga con Locust
\\\ash
locust -f locustfile.py --host=http://127.0.0.1:8000
# Abrir http://localhost:8089 en el navegador
\\\

## 🔄 CI/CD

El proyecto incluye GitHub Actions que ejecuta automáticamente:
- Instalación de dependencias
- Migraciones de base de datos
- Ejecución de tests unitarios
- Validación de código

Ver: [.github/workflows/django-ci.yml](.github/workflows/django-ci.yml)

## 📊 Métricas de Rendimiento

| Endpoint | Tiempo Promedio | Status |
|----------|----------------|--------|
| GET /api/products/ | < 100ms | ✅ |
| POST /api/auth/login/ | < 150ms | ✅ |
| GET /api/cart/ | < 120ms | ✅ |
| POST /api/orders/create/ | < 200ms | ✅ |

## 📁 Estructura del Proyecto

\\\
shop-parceros/
├── config/              # Configuración principal
│   ├── settings.py      # Configuración Django
│   ├── urls.py          # URLs principales
│   └── wsgi.py
├── store/               # App principal de e-commerce
│   ├── models.py        # Modelos (Product, Cart, Order)
│   ├── views.py         # Vistas API REST
│   ├── serializers.py   # Serializers DRF
│   ├── urls.py          # URLs de la app
│   └── tests.py         # Tests unitarios
├── users/               # App de autenticación
│   ├── views.py         # Registro de usuarios
│   ├── serializers.py
│   └── urls.py
├── .github/workflows/   # CI/CD GitHub Actions
├── locustfile.py        # Pruebas de carga
├── populate_db.py       # Script para datos de prueba
├── requirements.txt     # Dependencias
└── manage.py
\\\

## 👤 Autor

**Kevin Fadey**
- GitHub: [@fadeykevin](https://github.com/fadeykevin)
- Proyecto: [shop-parceros](https://github.com/fadeykevin/shop-parceros)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (\git checkout -b feature/AmazingFeature\)
3. Commit tus cambios (\git commit -m 'Add AmazingFeature'\)
4. Push a la rama (\git push origin feature/AmazingFeature\)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o problemas, abre un [issue](https://github.com/fadeykevin/shop-parceros/issues).
