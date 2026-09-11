// Load cart from Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Get elements
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
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

    // Save cart to Local Storage
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    cartItems.innerHTML = "";

    let total = 0;
    let totalItems = 0;


    // Check if cart is empty
    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

    }


    // Display cart items
    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        totalItems += item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.classList.add("cart-item");


        cartItem.innerHTML = `

            <div class="cart-product">

                <strong>${item.name}</strong>

                <p>$${item.price}</p>

            </div>


            <div class="cart-controls">

                <button onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>


            <div class="cart-price">

                $${itemTotal}

            </div>


            <button
                class="remove-btn"
                onclick="removeItem(${index})">

                🗑️

            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    // Update cart counter
    cartCount.textContent = totalItems;


    // Update total price
    cartTotal.textContent = total;

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