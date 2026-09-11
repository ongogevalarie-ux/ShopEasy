// Load cart from Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Get elements
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartSubtotal = document.getElementById("cart-subtotal");
const deliveryFee = document.getElementById("delivery-fee");
const addToCartButtons = document.querySelectorAll(".add-to-cart");


// Add product to cart
addToCartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        // Check if product already exists
        const existingProduct = cart.find(
            item => item.name === name
        );

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }

        updateCart();

    });

});


// Update cart
function updateCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

    cartItems.innerHTML = "";

    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart to get started.</p>
            </div>
        `;

        cartSubtotal.textContent = "$0.00";
        deliveryFee.textContent = "$0.00";
        cartTotal.textContent = "$0.00";
        cartCount.textContent = "0";

        return;
    }

    cart.forEach((product, index) => {

        const itemTotal = product.price * product.quantity;

        subtotal += itemTotal;
        totalItems += product.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <div class="cart-product">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)} each</p>
                </div>

                <div class="cart-controls">

                    <button onclick="decreaseQuantity(${index})">
                        −
                    </button>

                    <span>${product.quantity}</span>

                    <button onclick="increaseQuantity(${index})">
                        +
                    </button>

                </div>

                <div class="cart-price">
                    $${itemTotal.toFixed(2)}
                </div>

                <button 
                    class="remove-btn"
                    onclick="removeItem(${index})">
                    Remove
                </button>

            </div>
        `;
    });

    // Delivery fee
    const delivery = subtotal >= 500 ? 0 : 10;

    const total = subtotal + delivery;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    deliveryFee.textContent =
        delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`;

    cartTotal.textContent = `$${total.toFixed(2)}`;

    cartCount.textContent = totalItems;
}


// Increase quantity
function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();

}


// Decrease quantity
function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    updateCart();

}


// Remove item
function removeItem(index) {

    cart.splice(index, 1);

    updateCart();

}


// Load cart when page opens
updateCart();
// ===============================
// SEARCH AND CATEGORY FILTERING
// ===============================

const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll(".category-btn");
const productCards = document.querySelectorAll(".product-card");

let selectedCategory = "all";

// Search products
searchInput.addEventListener("input", filterProducts);

// Category buttons
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

        // Remove active class from all buttons
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Add active class to clicked button
        button.classList.add("active");

        // Get selected category
        selectedCategory = button.dataset.category;

        filterProducts();
    });
});

// Filter products
function filterProducts() {

    const searchText = searchInput.value.toLowerCase();

    productCards.forEach(card => {

        const productName = card.querySelector("h3").textContent.toLowerCase();
        const productCategory = card.dataset.category;

        const matchesSearch = productName.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
// ===============================
// PRODUCT DETAILS
// ===============================

const productDetails = document.getElementById("product-details");
const productsSection = document.getElementById("products");

const detailsImage = document.getElementById("details-image");
const detailsName = document.getElementById("details-name");
const detailsPrice = document.getElementById("details-price");
const detailsCategory = document.getElementById("details-category");
const detailsDescription = document.getElementById("details-description");

const detailsQuantity = document.getElementById("details-quantity");
const detailsMinus = document.getElementById("details-minus");
const detailsPlus = document.getElementById("details-plus");
const detailsAddCart = document.getElementById("details-add-cart");
const backToProducts = document.getElementById("back-to-products");

let selectedProduct = null;
let selectedQuantity = 1;


// Open product details
document.querySelectorAll(".view-details").forEach(button => {

    button.addEventListener("click", () => {

        selectedProduct = {
            name: button.dataset.name,
            price: Number(button.dataset.price),
            category: button.dataset.category,
            image: button.dataset.image,
            description: button.dataset.description
        };

        selectedQuantity = 1;

        detailsImage.src = selectedProduct.image;
        detailsImage.alt = selectedProduct.name;

        detailsName.textContent = selectedProduct.name;
        detailsPrice.textContent = `$${selectedProduct.price}`;
        detailsCategory.textContent = selectedProduct.category;
        detailsDescription.textContent = selectedProduct.description;

        detailsQuantity.textContent = selectedQuantity;

        productsSection.style.display = "none";
        productDetails.classList.remove("hidden");

        window.scrollTo({
            top: productDetails.offsetTop,
            behavior: "smooth"
        });
    });

});


// Increase quantity
detailsPlus.addEventListener("click", () => {

    selectedQuantity++;

    detailsQuantity.textContent = selectedQuantity;

});


// Decrease quantity
detailsMinus.addEventListener("click", () => {

    if (selectedQuantity > 1) {
        selectedQuantity--;
    }

    detailsQuantity.textContent = selectedQuantity;

});


// Add product to cart
detailsAddCart.addEventListener("click", () => {

    if (!selectedProduct) return;

    const existingProduct = cart.find(
        item => item.name === selectedProduct.name
    );

    if (existingProduct) {

        existingProduct.quantity += selectedQuantity;

    } else {

        cart.push({
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity: selectedQuantity
        });

    }

    updateCart();

    alert(`${selectedProduct.name} added to your cart!`);

});


// Back to products
backToProducts.addEventListener("click", () => {

    productDetails.classList.add("hidden");

    productsSection.style.display = "block";

    window.scrollTo({
        top: productsSection.offsetTop,
        behavior: "smooth"
    });

});
// ===============================
// CHECKOUT
// ===============================

const checkoutSection = document.getElementById("checkout");
const checkoutForm = document.getElementById("checkout-form");
const checkoutItems = document.getElementById("checkout-items");

const checkoutSubtotal =
    document.getElementById("checkout-subtotal");

const checkoutDelivery =
    document.getElementById("checkout-delivery");

const checkoutTotal =
    document.getElementById("checkout-total");

const backToCart =
    document.getElementById("back-to-cart");

const checkoutButton =
    document.getElementById("checkout-btn");


// Open checkout

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty. Add a product first.");

        return;
    }

    showCheckout();

});


// Display checkout

function showCheckout() {

    document.getElementById("cart").style.display = "none";

    checkoutSection.classList.remove("hidden");

    renderCheckout();

    window.scrollTo({
        top: checkoutSection.offsetTop,
        behavior: "smooth"
    });

}


// Render order summary

function renderCheckout() {

    checkoutItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach(product => {

        const itemTotal =
            product.price * product.quantity;

        subtotal += itemTotal;

        checkoutItems.innerHTML += `
            <div class="checkout-item">

                <span class="checkout-item-name">
                    ${product.name} × ${product.quantity}
                </span>

                <span class="checkout-item-price">
                    $${itemTotal.toFixed(2)}
                </span>

            </div>
        `;

    });

    const delivery = subtotal >= 500 ? 0 : 10;

    const total = subtotal + delivery;

    checkoutSubtotal.textContent =
        `$${subtotal.toFixed(2)}`;

    checkoutDelivery.textContent =
        delivery === 0
            ? "FREE"
            : `$${delivery.toFixed(2)}`;

    checkoutTotal.textContent =
        `$${total.toFixed(2)}`;

}


// Back to cart

backToCart.addEventListener("click", () => {

    checkoutSection.classList.add("hidden");

    document.getElementById("cart").style.display = "block";

    window.scrollTo({
        top: document.getElementById("cart").offsetTop,
        behavior: "smooth"
    });

});
checkoutForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
        document.getElementById("customer-name").value;

    const paymentMethod =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;

    alert(
        `Thank you, ${name}!\n\n` +
        `Your order has been placed successfully.\n` +
        `Payment method: ${paymentMethod}`
    );

    // Clear cart
    cart = [];

    localStorage.removeItem("cart");

    updateCart();

    checkoutForm.reset();

    checkoutSection.classList.add("hidden");

    document.getElementById("cart").style.display = "block";

    window.scrollTo({
        top: document.getElementById("cart").offsetTop,
        behavior: "smooth"
    });

});