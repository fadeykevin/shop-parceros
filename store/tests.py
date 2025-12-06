from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Product

class ProductTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=99.99,
            stock=10
        )
    
    def test_list_products(self):
        '''Test: Listar productos'''
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_product_detail(self):
        '''Test: Obtener detalle de producto'''
        response = self.client.get(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product')
    
    def test_cart_requires_authentication(self):
        '''Test: Carrito requiere autenticación'''
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
    
    def test_user_registration(self):
        '''Test: Registro de usuario'''
        data = {
            'username': 'newuser',
            'email': 'newuser@test.com',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_user_login(self):
        '''Test: Login de usuario'''
        User.objects.create_user(username='testuser', password='testpass123')
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = self.client.post('/api/auth/login/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
