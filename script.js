// ========================================
// SHOPEASY - COMPLETE JAVASCRIPT
// ========================================

const API_URL = "http://127.0.0.1:8000/api/products/";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedCategory = "all";
let selectedProduct = null;
let selectedQuantity = 1;

// ========================================
// DOM ELEMENTS
// ========================================

const productsContainer = document.querySelector(".products-container");
const productsSection = document.getElementById("products");
const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll(".category-btn");

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartSubtotal = document.getElementById("cart-subtotal");
const deliveryFee = document.getElementById("delivery-fee");

const productDetails = document.getElementById("product-details");
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

const checkoutSection = document.getElementById("checkout");
const checkoutForm = document.getElementById("checkout-form");
const checkoutItems = document.getElementById("checkout-items");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutDelivery = document.getElementById("checkout-delivery");
const checkoutTotal = document.getElementById("checkout-total");
const backToCart = document.getElementById("back-to-cart");
const checkoutButton = document.getElementById("checkout-btn");

const confirmationSection =
    document.getElementById("order-confirmation");

const confirmationItems =
    document.getElementById("confirmation-items");

const confirmationSubtotal =
    document.getElementById("confirmation-subtotal");

const confirmationDelivery =
    document.getElementById("confirmation-delivery");

const confirmationTotal =
    document.getElementById("confirmation-total");

const confirmationName =
    document.getElementById("confirmation-name");

const confirmationEmail =
    document.getElementById("confirmation-email");

const confirmationPayment =
    document.getElementById("confirmation-payment");

const orderNumber =
    document.getElementById("order-number");

const continueShopping =
    document.getElementById("continue-shopping");

const menuToggle =
    document.getElementById("menu-toggle");

const navLinks =
    document.getElementById("nav-links");


// ========================================
// LOAD PRODUCTS FROM DJANGO
// ========================================

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        console.error("Error loading products:", error);

        if (productsContainer) {
            productsContainer.innerHTML = `
                <p class="no-products">
                    Unable to load products.
                    Please make sure Django is running.
                </p>
            `;
        }
    }
}


// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts(productsToDisplay) {

    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    if (productsToDisplay.length === 0) {
        productsContainer.innerHTML = `
            <p class="no-products">
                No products found.
            </p>
        `;

        return;
    }

    productsToDisplay.forEach((product) => {

        const price = Number(product.price || 0).toFixed(2);

        productsContainer.innerHTML += `
            <div
                class="product-card"
                data-category="${product.category}"
                data-id="${product.id}"
            >

                <div class="product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >
                </div>

                <h3>${product.name}</h3>

                <p class="product-price">
                    $${price}
                </p>

                <button
                    class="view-details"
                    data-id="${product.id}"
                >
                    View Details
                </button>

                <button
                    class="add-to-cart"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>
        `;
    });
}


// ========================================
// SEARCH
// ========================================

if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}


// ========================================
// CATEGORY FILTER
// ========================================

categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

        categoryButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterProducts();
    });
});


function filterProducts() {

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filteredProducts = products.filter((product) => {

        const productName =
            String(product.name || "").toLowerCase();

        const productCategory =
            String(product.category || "").toLowerCase();

        const matchesSearch =
            productName.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}


// ========================================
// PRODUCT BUTTONS
// ========================================

if (productsContainer) {

    productsContainer.addEventListener("click", (event) => {

        const button = event.target;

        if (
            !button ||
            !button.dataset ||
            !button.dataset.id
        ) {
            return;
        }

        const productId = Number(button.dataset.id);

        const product = products.find(
            (item) => item.id === productId
        );

        if (!product) return;


        // Add to cart
        if (button.classList.contains("add-to-cart")) {
            addProductToCart(product);
        }


        // View details
        if (button.classList.contains("view-details")) {
            openProductDetails(product);
        }

    });
}


// ========================================
// ADD PRODUCT TO CART
// ========================================

function addProductToCart(product) {

    const existingProduct = cart.find(
        (item) => item.id === product.id
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price || 0),
            quantity: 1
        });
    }

    updateCart();

    alert(`${product.name} added to your cart!`);
}


// ========================================
// PRODUCT DETAILS
// ========================================

function openProductDetails(product) {

    if (!productDetails) return;

    selectedProduct = {
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        category: product.category,
        image: product.image,
        description:
            product.description ||
            "No description available."
    };

    selectedQuantity = 1;


    if (detailsImage) {
        detailsImage.src = selectedProduct.image;
        detailsImage.alt = selectedProduct.name;
    }

    if (detailsName) {
        detailsName.textContent = selectedProduct.name;
    }

    if (detailsPrice) {
        detailsPrice.textContent =
            `$${selectedProduct.price.toFixed(2)}`;
    }

    if (detailsCategory) {
        detailsCategory.textContent =
            selectedProduct.category;
    }

    if (detailsDescription) {
        detailsDescription.textContent =
            selectedProduct.description;
    }

    if (detailsQuantity) {
        detailsQuantity.textContent =
            selectedQuantity;
    }


    if (productsSection) {
        productsSection.style.display = "none";
    }

    productDetails.classList.remove("hidden");

    window.scrollTo({
        top: productDetails.offsetTop,
        behavior: "smooth"
    });
}


// ========================================
// PRODUCT QUANTITY
// ========================================

if (detailsPlus) {

    detailsPlus.addEventListener("click", () => {

        selectedQuantity += 1;

        if (detailsQuantity) {
            detailsQuantity.textContent =
                selectedQuantity;
        }
    });
}


if (detailsMinus) {

    detailsMinus.addEventListener("click", () => {

        if (selectedQuantity > 1) {
            selectedQuantity -= 1;
        }

        if (detailsQuantity) {
            detailsQuantity.textContent =
                selectedQuantity;
        }
    });
}


// ========================================
// ADD FROM PRODUCT DETAILS
// ========================================

if (detailsAddCart) {

    detailsAddCart.addEventListener("click", () => {

        if (!selectedProduct) return;

        const existingProduct = cart.find(
            (item) =>
                item.id === selectedProduct.id
        );

        if (existingProduct) {

            existingProduct.quantity +=
                selectedQuantity;

        } else {

            cart.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: selectedQuantity
            });
        }

        updateCart();

        alert(
            `${selectedProduct.name} added to your cart!`
        );
    });
}


// ========================================
// BACK TO PRODUCTS
// ========================================

if (backToProducts) {

    backToProducts.addEventListener("click", () => {

        if (productDetails) {
            productDetails.classList.add("hidden");
        }

        if (productsSection) {

            productsSection.style.display = "block";

            window.scrollTo({
                top: productsSection.offsetTop,
                behavior: "smooth"
            });
        }
    });
}


// ========================================
// UPDATE CART
// ========================================

function updateCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    if (
        !cartItems ||
        !cartSubtotal ||
        !deliveryFee ||
        !cartTotal ||
        !cartCount
    ) {
        return;
    }

    cartItems.innerHTML = "";

    let subtotal = 0;
    let totalItems = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some products to get started.</p>
            </div>
        `;

        cartSubtotal.textContent = "$0.00";
        deliveryFee.textContent = "$0.00";
        cartTotal.textContent = "$0.00";
        cartCount.textContent = "0";

        return;
    }


    cart.forEach((product, index) => {

        const itemTotal =
            product.price * product.quantity;

        subtotal += itemTotal;

        totalItems += product.quantity;


        cartItems.innerHTML += `
            <div class="cart-item">

                <div class="cart-product">

                    <h3>${product.name}</h3>

                    <p>
                        $${Number(product.price).toFixed(2)}
                        each
                    </p>

                </div>


                <div class="cart-controls">

                    <button
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${product.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                </div>


                <div class="cart-price">
                    $${itemTotal.toFixed(2)}
                </div>


                <button
                    class="remove-btn"
                    onclick="removeItem(${index})"
                >
                    Remove
                </button>

            </div>
        `;
    });


    const delivery =
        subtotal >= 500 ? 0 : 10;

    const total =
        subtotal + delivery;


    cartSubtotal.textContent =
        `$${subtotal.toFixed(2)}`;

    deliveryFee.textContent =
        delivery === 0
            ? "FREE"
            : `$${delivery.toFixed(2)}`;

    cartTotal.textContent =
        `$${total.toFixed(2)}`;

    cartCount.textContent =
        totalItems;
}


// ========================================
// CART QUANTITY CONTROLS
// ========================================

function increaseQuantity(index) {

    if (!cart[index]) return;

    cart[index].quantity += 1;

    updateCart();
}


function decreaseQuantity(index) {

    if (!cart[index]) return;

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);
    }

    updateCart();
}


function removeItem(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    updateCart();
}


window.increaseQuantity =
    increaseQuantity;

window.decreaseQuantity =
    decreaseQuantity;

window.removeItem =
    removeItem;


// ========================================
// CHECKOUT
// ========================================

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Add a product first."
                );

                return;
            }

            showCheckout();
        }
    );
}


function showCheckout() {

    const cartSection =
        document.getElementById("cart");

    if (cartSection) {
        cartSection.style.display = "none";
    }

    if (!checkoutSection) return;

    checkoutSection.classList.remove("hidden");

    renderCheckout();

    window.scrollTo({
        top: checkoutSection.offsetTop,
        behavior: "smooth"
    });
}


// ========================================
// RENDER CHECKOUT
// ========================================

function renderCheckout() {

    if (
        !checkoutItems ||
        !checkoutSubtotal ||
        !checkoutDelivery ||
        !checkoutTotal
    ) {
        return;
    }

    checkoutItems.innerHTML = "";

    let subtotal = 0;


    cart.forEach((product) => {

        const itemTotal =
            product.price * product.quantity;

        subtotal += itemTotal;


        checkoutItems.innerHTML += `
            <div class="checkout-item">

                <span class="checkout-item-name">
                    ${product.name} ×
                    ${product.quantity}
                </span>

                <span class="checkout-item-price">
                    $${itemTotal.toFixed(2)}
                </span>

            </div>
        `;
    });


    const delivery =
        subtotal >= 500 ? 0 : 10;

    const total =
        subtotal + delivery;


    checkoutSubtotal.textContent =
        `$${subtotal.toFixed(2)}`;

    checkoutDelivery.textContent =
        delivery === 0
            ? "FREE"
            : `$${delivery.toFixed(2)}`;

    checkoutTotal.textContent =
        `$${total.toFixed(2)}`;
}


// ========================================
// BACK TO CART
// ========================================

if (backToCart) {

    backToCart.addEventListener(
        "click",
        () => {

            if (checkoutSection) {
                checkoutSection.classList.add("hidden");
            }

            const cartSection =
                document.getElementById("cart");

            if (cartSection) {

                cartSection.style.display = "block";

                window.scrollTo({
                    top: cartSection.offsetTop,
                    behavior: "smooth"
                });
            }
        }
    );
}


// ========================================
// CHECKOUT FORM
// ========================================

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const customerName =
                document.getElementById(
                    "customer-name"
                ).value;

            const customerEmail =
                document.getElementById(
                    "customer-email"
                ).value;


            const selectedPayment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            const paymentMethod =
                selectedPayment
                    ? selectedPayment.value
                    : "Not selected";


            let subtotal = 0;


            cart.forEach((product) => {

                subtotal +=
                    product.price *
                    product.quantity;
            });


            const delivery =
                subtotal >= 500 ? 0 : 10;

            const total =
                subtotal + delivery;


            const generatedOrderNumber =
                `SE-${Date.now()
                    .toString()
                    .slice(-6)}`;


            if (confirmationName) {
                confirmationName.textContent =
                    customerName;
            }

            if (confirmationEmail) {
                confirmationEmail.textContent =
                    customerEmail;
            }

            if (confirmationPayment) {
                confirmationPayment.textContent =
                    paymentMethod;
            }

            if (orderNumber) {
                orderNumber.textContent =
                    generatedOrderNumber;
            }


            // Display ordered products

            if (confirmationItems) {

                confirmationItems.innerHTML = "";


                cart.forEach((product) => {

                    const itemTotal =
                        product.price *
                        product.quantity;


                    confirmationItems.innerHTML += `
                        <div class="confirmation-item">

                            <span
                                class="confirmation-item-name"
                            >
                                ${product.name} ×
                                ${product.quantity}
                            </span>

                            <span
                                class="confirmation-item-price"
                            >
                                $${itemTotal.toFixed(2)}
                            </span>

                        </div>
                    `;
                });
            }


            if (confirmationSubtotal) {

                confirmationSubtotal.textContent =
                    `$${subtotal.toFixed(2)}`;
            }


            if (confirmationDelivery) {

                confirmationDelivery.textContent =
                    delivery === 0
                        ? "FREE"
                        : `$${delivery.toFixed(2)}`;
            }


            if (confirmationTotal) {

                confirmationTotal.textContent =
                    `$${total.toFixed(2)}`;
            }


            // Hide checkout

            if (checkoutSection) {
                checkoutSection.classList.add("hidden");
            }


            // Show confirmation

            if (confirmationSection) {

                confirmationSection.classList.remove(
                    "hidden"
                );

                window.scrollTo({
                    top:
                        confirmationSection.offsetTop,
                    behavior: "smooth"
                });
            }


            // Clear cart

            cart = [];

            localStorage.removeItem("cart");

            updateCart();


            // Reset form

            checkoutForm.reset();
        }
    );
}


// ========================================
// CONTINUE SHOPPING
// ========================================

if (continueShopping) {

    continueShopping.addEventListener(
        "click",
        () => {

            if (confirmationSection) {

                confirmationSection.classList.add(
                    "hidden"
                );
            }

            if (productsSection) {

                productsSection.style.display =
                    "block";

                window.scrollTo({
                    top:
                        productsSection.offsetTop,
                    behavior: "smooth"
                });
            }
        }
    );
}


// ========================================
// MOBILE NAVIGATION
// ========================================

if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle("show");
        }
    );


    document
        .querySelectorAll(".nav-links a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove(
                        "show"
                    );
                }
            );
        });
}


// ========================================
// INITIALIZE WEBSITE
// ========================================

loadProducts();

updateCart();