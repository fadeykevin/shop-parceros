from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Product, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializer, CartSerializer, OrderSerializer
from .permissions import IsAdminOrReadOnly

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, _ = Cart.objects.get_or_create(user=request.user, active=True)
    return Response(CartSerializer(cart).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    product = get_object_or_404(Product, id=product_id)
    if product.stock < quantity:
        return Response({'error': 'Stock insuficiente'}, status=400)
    cart, _ = Cart.objects.get_or_create(user=request.user, active=True)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity
    item.save()
    return Response(CartSerializer(cart).data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    cart = get_object_or_404(Cart, user=request.user, active=True)
    item = get_object_or_404(CartItem, id=item_id, cart=cart)
    item.delete()
    return Response(CartSerializer(cart).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_order(request):
    cart = get_object_or_404(Cart, user=request.user, active=True)
    items = cart.items.select_related('product').all()
    if not items:
        return Response({'error': 'Carrito vacío'}, status=400)
    total = sum(item.product.price * item.quantity for item in items)
    order = Order.objects.create(user=request.user, total=total, shipping_address=request.data.get('shipping_address', ''))
    for item in items:
        OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
        item.product.stock -= item.quantity
        item.product.save()
    cart.active = False
    cart.save()
    return Response(OrderSerializer(order).data, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    orders = Order.objects.filter(user=request.user)
    return Response(OrderSerializer(orders, many=True).data)
