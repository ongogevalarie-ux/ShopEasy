// ======================================================
// ShopEasy - Main JavaScript
// Multi-page version
// ======================================================


// ======================================================
// API URLs
// ======================================================

const API_URL = "http://127.0.0.1:8000/api/products/";
const ORDER_API_URL = "http://127.0.0.1:8000/api/products/orders/";
const REGISTER_API_URL = "http://127.0.0.1:8000/api/accounts/register/";
const LOGIN_API_URL = "http://127.0.0.1:8000/api/accounts/login/";
const MY_ORDERS_API_URL = "http://127.0.0.1:8000/api/products/my-orders/";


// ======================================================
// Shared Cart
// ======================================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Save cart
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// Update cart count on every page
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    const totalItems = cart.reduce(
        (total, item) => total + Number(item.quantity),
        0
    );

    cartCount.textContent = totalItems;
}


// ======================================================
// Authentication
// ======================================================

function getAccessToken() {
    return localStorage.getItem("access_token");
}


function getRefreshToken() {
    return localStorage.getItem("refresh_token");
}


function isLoggedIn() {
    return !!getAccessToken();
}


// Update navigation based on login status
function updateAuthUI() {

    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const myOrdersBtn = document.getElementById("my-orders-btn");
    const userDisplay = document.getElementById("user-display");
    const logoutBtn = document.getElementById("logout-btn");

    if (!loginBtn || !registerBtn || !myOrdersBtn || !logoutBtn) {
        return;
    }

    const loggedIn = isLoggedIn();

    if (loggedIn) {

        loginBtn.classList.add("hidden");
        registerBtn.classList.add("hidden");

        myOrdersBtn.classList.remove("hidden");
        logoutBtn.classList.remove("hidden");

        const username = localStorage.getItem("username");

        if (userDisplay) {
            userDisplay.textContent = username
                ? `Hello, ${username}`
                : "Logged in";

            userDisplay.classList.remove("hidden");
        }

    } else {

        loginBtn.classList.remove("hidden");
        registerBtn.classList.remove("hidden");

        myOrdersBtn.classList.add("hidden");
        logoutBtn.classList.add("hidden");

        if (userDisplay) {
            userDisplay.classList.add("hidden");
        }
    }
}


// Logout
function logout() {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    updateAuthUI();

    window.location.href = "index.html";
}


// ======================================================
// Mobile Navigation
// ======================================================

function setupMobileMenu() {

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

    });
}


// ======================================================
// Product Page
// ======================================================

function setupProductPage() {

    const productsContainer =
        document.getElementById("products-container");

    // This page doesn't have the products container
    if (!productsContainer) {
        return;
    }

    // Load products from Django
    loadProducts();

}
// ======================================================
// Load Products From Django
// ======================================================

let allProducts = [];

async function loadProducts() {

    const productsContainer =
        document.getElementById("products-container");

    if (!productsContainer) {
        return;
    }

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        allProducts = await response.json();

        console.log("Products loaded from Django:", allProducts);

        displayProducts(allProducts);

        setupProductFilters();

    } catch (error) {

        console.error("Product loading error:", error);

        productsContainer.innerHTML = `
            <div class="products-error">
                <h3>Unable to load products</h3>
                <p>
                    Please make sure the Django server is running.
                </p>
            </div>
        `;

    }

}
function displayProducts(products) {

    const productsContainer =
        document.getElementById("products-container");

    if (!productsContainer) {
        return;
    }


    if (products.length === 0) {

        productsContainer.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }


    productsContainer.innerHTML = "";


    products.forEach(function (product) {

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.dataset.id = product.id;

        card.dataset.name = product.name;

        card.dataset.price = product.price;

        card.dataset.category =
            product.category || "";


        const imageURL =
            product.image
                ? product.image
                : "images/placeholder.jpg";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${imageURL}"
                    alt="${product.name}"
                >

            </div>


            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description || ""}
                </p>

                <div class="product-bottom">

                    <span class="price">
                        KSH.
                        ${Number(product.price).toFixed(2)}
                    </span>

                    <div class="product-actions">

                <button
                    class="details-btn"
                    data-id="${product.id}">
                    Product Details
                </button>

                <button
                    class="add-to-cart"
                    data-id="${product.id}">
                    Add to Cart
                </button>

                     </div>

                </div>

            </div>

        `;


        productsContainer.appendChild(card);

    });


    setupAddToCartButtons();
    setupProductDetailsButtons();

}
function setupAddToCartButtons() {

    const buttons =
        document.querySelectorAll(".add-to-cart");


    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productId =
                Number(button.dataset.id);


            const product =
                allProducts.find(function (item) {

                    return Number(item.id) === productId;

                });


            if (!product) {

                console.error(
                    "Product not found:",
                    productId
                );

                return;

            }


            const existingItem =
                cart.find(function (item) {

                    return Number(item.id) === productId;

                });


            if (existingItem) {

                existingItem.quantity += 1;

            } else {

                cart.push({

                    id: product.id,

                    name: product.name,

                    price: Number(product.price),

                    image: product.image || "",

                    quantity: 1

                });

            }


            saveCart();

            updateCartCount();


            alert(
                `${product.name} added to cart!`
            );

        });

    });

}
function setupProductFilters() {

    const searchInput =
        document.getElementById("search-input");

    const categoryButtons =
        document.querySelectorAll(".category-btn");


    // Search
    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    // Categories
    categoryButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                categoryButtons.forEach(
                    function (btn) {

                        btn.classList.remove("active");

                    }
                );


                button.classList.add("active");

                filterProducts();

            }
        );

    });

}
function filterProducts() {

    const searchInput =
        document.getElementById("search-input");


    const searchTerm =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const activeCategory =
        document.querySelector(
            ".category-btn.active"
        );


    const category =
        activeCategory
            ? activeCategory.dataset.category
            : "all";


    const filteredProducts =
        allProducts.filter(function (product) {

            const name =
                (product.name || "").toLowerCase();

            const description =
                (product.description || "").toLowerCase();

            const productCategory =
                (product.category || "").toLowerCase();


            const matchesSearch =
                name.includes(searchTerm) ||
                description.includes(searchTerm);


            const matchesCategory =
                category === "all" ||
                productCategory === category;


            return matchesSearch &&
                   matchesCategory;

        });


    displayProducts(filteredProducts);

}
function setupProductDetailsButtons() {

    const buttons =
        document.querySelectorAll(".details-btn");


    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productId =
                button.dataset.id;


            window.location.href =
                `product-details.html?id=${productId}`;

        });

    });

}
function setupProductDetailsPage() {

    const container =
        document.getElementById(
            "product-details-container"
        );


    if (!container) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    if (!productId) {

        container.innerHTML = `
            <div class="product-error">

                <h2>Product not found</h2>

                <a href="products.html">
                    Back to Products
                </a>

            </div>
        `;

        return;
    }


    loadProductDetails(productId);

}
async function loadProductDetails(productId) {

    const container =
        document.getElementById(
            "product-details-container"
        );


    try {

        const response =
            await fetch(
                `${API_URL}${productId}/`
            );


        if (!response.ok) {

            throw new Error(
                "Product not found"
            );

        }


        const product =
            await response.json();


        const imageURL =
            product.image ||
            "images/placeholder.jpg";


        container.innerHTML = `

            <a
                href="products.html"
                class="back-btn">
                ← Back to Products
            </a>


            <div class="product-details-card">

                <div class="product-details-image">

                    <img
                        src="${imageURL}"
                        alt="${product.name}">

                </div>


                <div class="product-details-info">

                    <h1>
                        ${product.name}
                    </h1>


                    <p class="product-details-description">
                        ${product.description || "No description available."}
                    </p>


                    <div class="product-details-price">

                        KSH.
                        ${Number(product.price).toFixed(2)}

                    </div>


                    <p class="product-stock">

                        ${
                            Number(product.stock) > 0
                                ? `In Stock: ${product.stock}`
                                : "Out of Stock"
                        }

                    </p>


                    <div class="product-details-actions">

                        <button
                            id="details-add-to-cart"
                            class="add-to-cart"
                            data-id="${product.id}"
                            ${
                                Number(product.stock) <= 0
                                    ? "disabled"
                                    : ""
                            }>

                            ${
                                Number(product.stock) > 0
                                    ? "Add to Cart"
                                    : "Out of Stock"
                            }

                        </button>


                        <a
                            href="products.html"
                            class="back-btn">
                            Continue Shopping
                        </a>

                    </div>

                </div>

            </div>

        `;


        const addButton =
            document.getElementById(
                "details-add-to-cart"
            );


        if (addButton) {

            addButton.addEventListener(
                "click",
                function () {

                    const existingItem =
                        cart.find(function (item) {

                            return Number(item.id) ===
                                Number(product.id);

                        });


                    if (existingItem) {

                        existingItem.quantity += 1;

                    } else {

                        cart.push({

                            id: product.id,

                            name: product.name,

                            price: Number(product.price),

                            image: product.image || "",

                            quantity: 1

                        });

                    }


                    saveCart();

                    updateCartCount();


                    alert(
                        `${product.name} added to cart!`
                    );

                }
            );

        }


    } catch (error) {

        console.error(
            "Product details error:",
            error
        );


        container.innerHTML = `

            <div class="product-error">

                <h2>
                    Unable to load product
                </h2>

                <p>
                    Please make sure Django is running.
                </p>

                <a
                    href="products.html"
                    class="back-btn">
                    Back to Products
                </a>

            </div>

        `;

    }

}
// ======================================================
// Cart Page
// ======================================================

function setupCartPage() {

    const cartItemsContainer =
        document.getElementById("cart-items");

    if (!cartItemsContainer) {
        return;
    }


    renderCart();


    // Checkout button
    const checkoutButton =
        document.getElementById("checkout-btn");


    if (checkoutButton) {

        checkoutButton.addEventListener("click", function () {

            if (cart.length === 0) {

                alert("Your cart is empty.");

                return;
            }

            window.location.href = "checkout.html";

        });

    }

}


// Render cart
function renderCart() {

    const cartItemsContainer =
        document.getElementById("cart-items");

    if (!cartItemsContainer) {
        return;
    }


    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart.</p>

                <a href="products.html" class="checkout-btn">
                    Browse Products
                </a>
            </div>
        `;

        updateCartSummary();

        return;
    }


    cartItemsContainer.innerHTML = "";


    cart.forEach(function (item, index) {

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

            </div>


            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>
                    KSH. ${Number(item.price).toFixed(2)}
                </p>

            </div>


            <div class="cart-item-controls">

                <button
                    class="quantity-btn decrease-btn"
                    data-index="${index}">
                    −
                </button>

                <span class="quantity">
                    ${item.quantity}
                </span>

                <button
                    class="quantity-btn increase-btn"
                    data-index="${index}">
                    +
                </button>

            </div>


            <div class="cart-item-total">

                KSH.
                ${(Number(item.price) *
                    Number(item.quantity)).toFixed(2)}

            </div>


            <button
                class="remove-btn"
                data-index="${index}">
                Remove
            </button>

        `;


        cartItemsContainer.appendChild(cartItem);

    });


    setupCartButtons();

    updateCartSummary();

}


// Cart buttons
function setupCartButtons() {

    const increaseButtons =
        document.querySelectorAll(".increase-btn");

    const decreaseButtons =
        document.querySelectorAll(".decrease-btn");

    const removeButtons =
        document.querySelectorAll(".remove-btn");


    increaseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(button.dataset.index);

            cart[index].quantity += 1;

            saveCart();

            renderCart();

            updateCartCount();

        });

    });


    decreaseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(button.dataset.index);

            if (cart[index].quantity > 1) {

                cart[index].quantity -= 1;

            } else {

                cart.splice(index, 1);

            }

            saveCart();

            renderCart();

            updateCartCount();

        });

    });


    removeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(button.dataset.index);

            cart.splice(index, 1);

            saveCart();

            renderCart();

            updateCartCount();

        });

    });

}


// ======================================================
// Cart Summary
// ======================================================

function calculateSubtotal() {

    return cart.reduce(function (total, item) {

        return total +
            Number(item.price) *
            Number(item.quantity);

    }, 0);

}


function updateCartSummary() {

    const subtotal =
        calculateSubtotal();

    const deliveryFee =
        cart.length > 0 ? 200 : 0;

    const total =
        subtotal + deliveryFee;


    const subtotalElement =
        document.getElementById("cart-subtotal");

    const deliveryElement =
        document.getElementById("delivery-fee");

    const totalElement =
        document.getElementById("cart-total");


    if (subtotalElement) {
        subtotalElement.textContent =
            `KSH. ${subtotal.toFixed(2)}`;
    }

    if (deliveryElement) {
        deliveryElement.textContent =
            `KSH. ${deliveryFee.toFixed(2)}`;
    }

    if (totalElement) {
        totalElement.textContent =
            `KSH. ${total.toFixed(2)}`;
    }

}


// ======================================================
// Checkout Page
// ======================================================

function setupCheckoutPage() {

    const checkoutForm =
        document.getElementById("checkout-form");

    if (!checkoutForm) {
        return;
    }


    if (cart.length === 0) {

        alert("Your cart is empty.");

        window.location.href = "products.html";

        return;
    }


    renderCheckoutSummary();


    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await placeOrder();

        }
    );

}


// Render checkout summary
function renderCheckoutSummary() {

    const container =
        document.getElementById("checkout-items");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    cart.forEach(function (item) {

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "checkout-item";


        itemElement.innerHTML = `

            <span>
                ${item.name} × ${item.quantity}
            </span>

            <span>
                KSH.
                ${(Number(item.price) *
                    Number(item.quantity)).toFixed(2)}
            </span>

        `;


        container.appendChild(itemElement);

    });


    const subtotal =
        calculateSubtotal();

    const delivery =
        200;

    const total =
        subtotal + delivery;


    const subtotalElement =
        document.getElementById("checkout-subtotal");

    const deliveryElement =
        document.getElementById("checkout-delivery");

    const totalElement =
        document.getElementById("checkout-total");


    if (subtotalElement) {

        subtotalElement.textContent =
            `KSH. ${subtotal.toFixed(2)}`;

    }

    if (deliveryElement) {

        deliveryElement.textContent =
            `KSH. ${delivery.toFixed(2)}`;

    }

    if (totalElement) {

        totalElement.textContent =
            `KSH. ${total.toFixed(2)}`;

    }

}


// ======================================================
// Place Order
// ======================================================

async function placeOrder() {

    const accessToken =
        getAccessToken();


    if (!accessToken) {

        alert("Please log in before placing an order.");

        window.location.href = "login.html";

        return;
    }


    const customerName =
        document.getElementById("customer-name")?.value.trim();

    const customerEmail =
        document.getElementById("customer-email")?.value.trim();

    const customerPhone =
        document.getElementById("customer-phone")?.value.trim();

    const deliveryAddress =
        document.getElementById("delivery-address")?.value.trim();


    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        )?.value;


    const subtotal =
        calculateSubtotal();

    const deliveryFee =
        200;

    const total =
        subtotal + deliveryFee;


    const items =
        cart.map(function (item) {

            return {
                product: Number(item.id),
                quantity: Number(item.quantity),
                price: Number(item.price)
            };

        });


    const orderData = {

        customer_name: customerName,

        customer_email: customerEmail,

        customer_phone: customerPhone,

        delivery_address: deliveryAddress,

        payment_method: payment,

        subtotal: subtotal.toFixed(2),

        delivery_fee: deliveryFee.toFixed(2),

        total: total.toFixed(2),

        items: items

    };


    const placeOrderButton =
        document.querySelector(".place-order-btn");


    if (placeOrderButton) {

        placeOrderButton.disabled = true;

        placeOrderButton.textContent =
            "Placing Order...";

    }


    try {

        const response =
            await fetch(ORDER_API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${accessToken}`

                },

                body:
                    JSON.stringify(orderData)

            });


        const data =
            await response.json();


        if (!response.ok) {

            console.error("Order error:", data);

            alert(
                data.detail ||
                "Unable to place order. Please check your details."
            );

            if (placeOrderButton) {

                placeOrderButton.disabled = false;

                placeOrderButton.textContent =
                    "Place Order";

            }

            return;
        }


        // Clear cart after successful order
        cart = [];

        saveCart();

        updateCartCount();


        // Save order temporarily for confirmation page
        localStorage.setItem(
            "last_order",
            JSON.stringify(data)
        );


        window.location.href =
            "order-confirmation.html";


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the ShopEasy server."
        );


        if (placeOrderButton) {

            placeOrderButton.disabled = false;

            placeOrderButton.textContent =
                "Place Order";

        }

    }

}


// ======================================================
// My Orders Page
// ======================================================

function setupMyOrdersPage() {

    const ordersList =
        document.getElementById("orders-list");

    if (!ordersList) {
        return;
    }


    if (!isLoggedIn()) {

        ordersList.innerHTML = `

            <div class="login-required">

                <h3>Please log in</h3>

                <p>
                    You need to log in to view your orders.
                </p>

                <a href="login.html"
                   class="checkout-btn">
                    Login
                </a>

            </div>

        `;

        return;
    }


    loadMyOrders();

}


// Load orders from Django
async function loadMyOrders() {

    const ordersList =
        document.getElementById("orders-list");

    if (!ordersList) {
        return;
    }


    try {

        const response =
            await fetch(MY_ORDERS_API_URL, {

                method: "GET",

                headers: {

                    "Authorization":
                        `Bearer ${getAccessToken()}`,

                    "Content-Type":
                        "application/json"

                }

            });


        if (response.status === 401) {

            ordersList.innerHTML = `

                <div class="login-required">

                    <h3>Session expired</h3>

                    <p>
                        Please log in again.
                    </p>

                    <a href="login.html"
                       class="checkout-btn">
                        Login
                    </a>

                </div>

            `;

            return;
        }


        const orders =
            await response.json();


        if (!response.ok) {

            console.error(orders);

            ordersList.innerHTML = `
                <p>
                    Unable to load your orders.
                </p>
            `;

            return;
        }


        if (!orders.length) {

            ordersList.innerHTML = `

                <div class="empty-orders">

                    <h3>No orders yet</h3>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a href="products.html"
                       class="checkout-btn">
                        Start Shopping
                    </a>

                </div>

            `;

            return;
        }


        ordersList.innerHTML = "";


        orders.forEach(function (order) {

            const orderElement =
                document.createElement("div");

            orderElement.className =
                "order-card";


            let itemsHTML = "";


            if (order.items && order.items.length > 0) {

                itemsHTML =
                    order.items.map(function (item) {

                        return `

                            <div class="order-item">

                                <span>
                                    ${item.product_name}
                                    × ${item.quantity}
                                </span>

                                <span>
                                    KSH.
                                    ${Number(item.price)
                                        .toFixed(2)}
                                </span>

                            </div>

                        `;

                    }).join("");

            }


            orderElement.innerHTML = `

                <div class="order-header">

                    <div>

                        <h3>
                            Order #${order.id}
                        </h3>

                        <p>
                            ${formatDate(order.created_at)}
                        </p>

                    </div>

                    <span class="order-status">
                        ${order.status}
                    </span>

                </div>


                <div class="order-items">

                    ${itemsHTML}

                </div>


                <div class="order-summary">

                    <div>
                        Subtotal:
                        <strong>
                            KSH.
                            ${Number(order.subtotal)
                                .toFixed(2)}
                        </strong>
                    </div>

                    <div>
                        Delivery:
                        <strong>
                            KSH.
                            ${Number(order.delivery_fee)
                                .toFixed(2)}
                        </strong>
                    </div>

                    <div>
                        Total:
                        <strong>
                            KSH.
                            ${Number(order.total)
                                .toFixed(2)}
                        </strong>
                    </div>

                </div>

            `;


            ordersList.appendChild(orderElement);

        });


    } catch (error) {

        console.error(error);

        ordersList.innerHTML = `

            <p>
                Could not connect to the ShopEasy server.
            </p>

        `;

    }

}


// Format date
function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(dateString);

    return date.toLocaleString();

}


// ======================================================
// Login
// ======================================================

function setupLoginPage() {

    const loginForm =
        document.getElementById("login-form");

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document.getElementById("login-username")
                    ?.value.trim();

            const password =
                document.getElementById("login-password")
                    ?.value;


            try {

                const response =
                    await fetch(LOGIN_API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password
                        })

                    });


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.detail ||
                        "Login failed."
                    );

                    return;
                }


                localStorage.setItem(
                    "access_token",
                    data.access
                );

                localStorage.setItem(
                    "refresh_token",
                    data.refresh
                );

                localStorage.setItem(
                    "username",
                    username
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(error);

                alert(
                    "Could not connect to the ShopEasy server."
                );

            }

        }
    );

}


// ======================================================
// Register
// ======================================================

function setupRegisterPage() {

    const registerForm =
        document.getElementById("register-form");

    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document.getElementById("register-username")
                    ?.value.trim();

            const email =
                document.getElementById("register-email")
                    ?.value.trim();

            const password =
                document.getElementById("register-password")
                    ?.value;


            try {

                const response =
                    await fetch(REGISTER_API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            username: username,

                            email: email,

                            password: password

                        })

                    });


                const data =
                    await response.json();


                if (!response.ok) {

                    console.error(data);

                    alert(
                        "Registration failed. " +
                        "Please check your details."
                    );

                    return;
                }


                alert(
                    "Registration successful! " +
                    "Please log in."
                );


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(error);

                alert(
                    "Could not connect to the ShopEasy server."
                );

            }

        }
    );

}


// ======================================================
// Global Event Listeners
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Shared on every page
        updateCartCount();

        updateAuthUI();

        setupMobileMenu();


        // Page-specific functionality
        setupProductPage();

        setupCartPage();

        setupCheckoutPage();

        setupMyOrdersPage();

        setupLoginPage();

        setupRegisterPage();

        setupProductDetailsPage();


        // Logout
        const logoutBtn =
            document.getElementById("logout-btn");


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                logout
            );

        }

    }
);