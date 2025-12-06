from locust import HttpUser, task, between
import random

class ShopParcerosUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        username = f'user_{random.randint(1000, 9999)}'
        self.client.post('/api/auth/register/', json={
            'username': username,
            'email': f'{username}@test.com',
            'password': 'Test1234',
            'password2': 'Test1234'
        })
        
        response = self.client.post('/api/auth/login/', json={
            'username': username,
            'password': 'Test1234'
        })
        
        if response.status_code == 200:
            self.token = response.json()['access']
            self.headers = {'Authorization': f'Bearer {self.token}'}
        else:
            self.headers = {}
    
    @task(3)
    def list_products(self):
        self.client.get('/api/products/')
    
    @task(2)
    def view_product_detail(self):
        product_id = random.randint(1, 10)
        self.client.get(f'/api/products/{product_id}/')
    
    @task(2)
    def view_cart(self):
        self.client.get('/api/cart/', headers=self.headers)
    
    @task(1)
    def add_to_cart(self):
        self.client.post('/api/cart/add/', 
                        json={'product_id': random.randint(1, 5), 'quantity': 1},
                        headers=self.headers)
