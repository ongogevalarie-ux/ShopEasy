from django.db import transaction
from rest_framework import serializers

from .models import (
    Product,
    Order,
    OrderItem
)


# ========================================
# PRODUCT SERIALIZER
# ========================================

class ProductSerializer(
    serializers.ModelSerializer
):

    image_url = serializers.SerializerMethodField()


    class Meta:

        model = Product

        fields = [
            'id',
            'name',
            'description',
            'price',
            'category',
            'image',
            'image_url',
            'stock',
            'created_at',
        ]


    def get_image_url(
        self,
        product
    ):

        request = self.context.get(
            'request'
        )


        if product.image:

            if request:

                return request.build_absolute_uri(
                    product.image.url
                )

            return product.image.url


        return None


# ========================================
# ORDER ITEM SERIALIZER
# ========================================

class OrderItemSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    class Meta:

        model = OrderItem

        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'price'
        ]


# ========================================
# ORDER SERIALIZER
# ========================================

class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True)

    user = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    class Meta:

        model = Order

        fields = [
            'id',
            'user',
            'customer_name',
            'customer_email',
            'customer_phone',
            'delivery_address',
            'payment_method',
            'subtotal',
            'delivery_fee',
            'total',
            'status',
            'items',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'user',
            'status',
            'created_at'
        ]


    def validate_items(self, items):

        for item in items:

            product = item['product']
            quantity = item['quantity']

            if quantity <= 0:

                raise serializers.ValidationError(
                    "Quantity must be greater than zero."
                )

            if product.stock < quantity:

                raise serializers.ValidationError(
                    f"Not enough stock for {product.name}. "
                    f"Available: {product.stock}"
                )

        return items


    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop('items')

        request = self.context.get('request')

        user = None

        if request and request.user.is_authenticated:
            user = request.user

        order = Order.objects.create(
            user=user,
            **validated_data
        )

        for item_data in items_data:

            product = item_data['product']
            quantity = item_data['quantity']
            price = item_data['price']

            if product.stock < quantity:

                raise serializers.ValidationError(
                    f"Sorry, {product.name} does not have enough stock."
                )

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )

            product.stock -= quantity

            product.save()

        return order