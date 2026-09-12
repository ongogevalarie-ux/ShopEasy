from rest_framework import generics
from .models import Product, Order
from .serializers import (
    ProductSerializer,
    OrderSerializer
)

# =====================================
# PRODUCT VIEWS
# =====================================
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# ========================================
# ORDER API
# ========================================

class OrderCreateView(
    generics.CreateAPIView
):

    queryset = Order.objects.all()

    serializer_class = OrderSerializer