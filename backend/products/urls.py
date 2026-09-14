from django.urls import path

from .views import (
    ProductListCreateView,
    ProductDetailView,
    OrderCreateView,
    MyOrdersView
)


urlpatterns = [

    # Products

    path(
        '',
        ProductListCreateView.as_view(),
        name='product-list'
    ),

    path(
        '<int:pk>/',
        ProductDetailView.as_view(),
        name='product-detail'
    ),


    # Orders

    path(
        'orders/',
        OrderCreateView.as_view(),
        name='create-order'
    ),

    path(
        'my-orders/',
        MyOrdersView.as_view(),
        name='my-orders'
    ),

]