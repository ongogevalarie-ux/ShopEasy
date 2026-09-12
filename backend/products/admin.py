from django.contrib import admin
from .models import Product, Order, OrderItem


# ========================================
# PRODUCT ADMIN
# ========================================

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'price',
        'category',
        'stock',
        'created_at',
    )

    list_filter = (
        'category',
    )

    search_fields = (
        'name',
        'description',
    )

    ordering = (
        '-created_at',
    )

    list_editable = (
        'stock',
    )

# ========================================
# ORDER ITEM INLINE
# ========================================

class OrderItemInline(
    admin.TabularInline
):

    model = OrderItem

    extra = 0

    readonly_fields = (
        'product',
        'quantity',
        'price',
    )


# ========================================
# ORDER ADMIN
# ========================================

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'customer_name',
        'customer_email',
        'total',
        'payment_method',
        'status',
        'created_at',
    )

    list_filter = (
        'status',
        'payment_method',
        'created_at',
    )

    search_fields = (
        'customer_name',
        'customer_email',
        'id',
    )

    ordering = (
        '-created_at',
    )

    list_editable = (
        'status',
    )

    readonly_fields = (
        'subtotal',
        'delivery_fee',
        'total',
        'created_at',
    )

    inlines = [
        OrderItemInline
    ]