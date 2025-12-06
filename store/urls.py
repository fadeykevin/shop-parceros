from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, get_cart, add_to_cart, remove_from_cart, create_order, list_orders

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('cart/', get_cart),
    path('cart/add/', add_to_cart),
    path('cart/remove/<int:item_id>/', remove_from_cart),
    path('orders/create/', create_order),
    path('orders/', list_orders),
]
