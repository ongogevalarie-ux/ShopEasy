// ========================================
// SHOPEASY - COMPLETE JAVASCRIPT
// ========================================

const API_URL = 
    "http://127.0.0.1:8000/api/products/";
const ORDER_API_URL =
    "http://127.0.0.1:8000/api/products/orders/";

const REGISTER_API_URL =
    "http://127.0.0.1:8000/api/accounts/register/";

const LOGIN_API_URL =
    "http://127.0.0.1:8000/api/accounts/login/";

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
                    src="${product.image_url || product.image || ''}"
                    alt="${product.name}"
                    >
                </div>

                <h3>${product.name}</h3>

                <p class="product-price">
                    KSH. ${price}
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
        image: product.image_url || product.image,
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
            `KSH. ${selectedProduct.price.toFixed(2)}`;
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

    backToProducts.addEventListener(
        "click",
        () => {

            showMainSection("products");

        }
    );
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

        cartSubtotal.textContent = "KSH. 0.00";
        deliveryFee.textContent = "KSH. 0.00";
        cartTotal.textContent = "KSH. 0.00";
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
                        KSH. ${Number(product.price).toFixed(2)}
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
                    KSH. ${itemTotal.toFixed(2)}
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
        subtotal >= 5000 ? 0 : 200;

    const total =
        subtotal + delivery;


    cartSubtotal.textContent =
        `KSH. ${subtotal.toFixed(2)}`;

    deliveryFee.textContent =
        delivery === 0
            ? "FREE"
            : `KSH. ${delivery.toFixed(2)}`;

    cartTotal.textContent =
        `KSH. ${total.toFixed(2)}`;

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
                    KSH. ${itemTotal.toFixed(2)}
                </span>

            </div>
        `;
    });


    const delivery =
        subtotal >= 5000 ? 0 : 200;

    const total =
        subtotal + delivery;


    checkoutSubtotal.textContent =
        `KSH. ${subtotal.toFixed(2)}`;

    checkoutDelivery.textContent =
        delivery === 0
            ? "FREE"
            : `KSH. ${delivery.toFixed(2)}`;

    checkoutTotal.textContent =
        `KSH. ${total.toFixed(2)}`;
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
        async (event) => {

            event.preventDefault();


            // ========================================
            // GET CUSTOMER DETAILS
            // ========================================

            const customerName =
                document
                    .getElementById(
                        "customer-name"
                    ).value;


            const customerEmail =
                document
                    .getElementById(
                        "customer-email"
                    ).value;


            const customerPhone =
                document
                    .getElementById(
                        "customer-phone"
                    ).value;


            const deliveryAddress =
                document
                    .getElementById(
                        "delivery-address"
                    ).value;


            const selectedPayment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            const paymentMethod =
                selectedPayment
                    ? selectedPayment.value
                    : "mpesa";


            // ========================================
            // CHECK CART
            // ========================================

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            // ========================================
            // CALCULATE TOTALS
            // ========================================

            let subtotal = 0;


            cart.forEach(product => {

                subtotal +=
                    product.price *
                    product.quantity;

            });


            const delivery =
                subtotal >= 5000
                    ? 0
                    : 200;


            const total =
                subtotal + delivery;


            // ========================================
            // CREATE ORDER DATA
            // ========================================

            const orderData = {

                customer_name:
                    customerName,

                customer_email:
                    customerEmail,

                customer_phone:
                    customerPhone,

                delivery_address:
                    deliveryAddress,

                payment_method:
                    paymentMethod,

                subtotal:
                    subtotal.toFixed(2),

                delivery_fee:
                    delivery.toFixed(2),

                total:
                    total.toFixed(2),

                items:
                    cart.map(product => ({

                        product:
                            product.id,

                        quantity:
                            product.quantity,

                        price:
                            product.price.toFixed(2)

                    }))

            };


            // ========================================
            // SEND ORDER TO DJANGO
            // ========================================

            try {

                const accessToken =
                localStorage.getItem("access_token");

                    const response = await fetch(
                   ORDER_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`
                    },

                    body: JSON.stringify(orderData)
                }
            );


                if (!response.ok) {

                    const errorData =
                        await response.json();


                    console.error(
                        "Order error:",
                        errorData
                    );


                    alert(
                        "Failed to place order."
                    );

                    return;

                }


                const savedOrder =
                    await response.json();


                console.log(
                    "Order saved:",
                    savedOrder
                );


                // ========================================
                // SHOW ORDER CONFIRMATION
                // ========================================

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
                        `SE-${savedOrder.id}`;

                }


                if (confirmationItems) {

                    confirmationItems.innerHTML =
                        "";


                    cart.forEach(product => {

                        const itemTotal =
                            product.price *
                            product.quantity;


                        confirmationItems.innerHTML += `

                            <div
                                class="confirmation-item"
                            >

                                <span
                                    class="confirmation-item-name"
                                >

                                    ${product.name}
                                    ×
                                    ${product.quantity}

                                </span>


                                <span
                                    class="confirmation-item-price"
                                >

                                    KSH. ${itemTotal.toFixed(2)}

                                </span>

                            </div>

                        `;

                    });

                }


                if (confirmationSubtotal) {

                    confirmationSubtotal.textContent =
                        `KSH. ${subtotal.toFixed(2)}`;

                }


                if (confirmationDelivery) {

                    confirmationDelivery.textContent =
                        delivery === 0
                            ? "FREE"
                            : `KSH. ${delivery.toFixed(2)}`;

                }


                if (confirmationTotal) {

                    confirmationTotal.textContent =
                        `KSH. ${total.toFixed(2)}`;

                }


                // ========================================
                // HIDE CHECKOUT
                // ========================================

                if (checkoutSection) {

                    checkoutSection.classList.add(
                        "hidden"
                    );

                }


                // ========================================
                // SHOW CONFIRMATION
                // ========================================

                if (confirmationSection) {

                    confirmationSection.classList.remove(
                        "hidden"
                    );


                    window.scrollTo({

                        top:
                            confirmationSection.offsetTop,

                        behavior:
                            "smooth"

                    });

                }


                // ========================================
                // CLEAR CART
                // ========================================

                cart = [];


                localStorage.removeItem(
                    "cart"
                );


                updateCart();


                checkoutForm.reset();


            } catch (error) {

                console.error(
                    "Order request error:",
                    error
                );


                alert(
                    "Unable to connect to the server. Please make sure Django is running."
                );

            }

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

            showMainSection("products");

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
// AUTHENTICATION
// ========================================

const loginBtn =
    document.getElementById("login-btn");

const registerBtn =
    document.getElementById("register-btn");

const logoutBtn =
    document.getElementById("logout-btn");

const userDisplay =
    document.getElementById("user-display");

const loginSection =
    document.getElementById("login-section");

const registerSection =
    document.getElementById("register-section");

const closeLogin =
    document.getElementById("close-login");

const closeRegister =
    document.getElementById("close-register");

const loginForm =
    document.getElementById("login-form");

const registerForm =
    document.getElementById("register-form");


// ========================================
// OPEN LOGIN
// ========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        () => {

            loginSection.classList.remove(
                "hidden"
            );

        }
    );

}


// ========================================
// CLOSE LOGIN
// ========================================

if (closeLogin) {

    closeLogin.addEventListener(
        "click",
        () => {

            loginSection.classList.add(
                "hidden"
            );

        }
    );

}


// ========================================
// OPEN REGISTER
// ========================================

if (registerBtn) {

    registerBtn.addEventListener(
        "click",
        () => {

            registerSection.classList.remove(
                "hidden"
            );

        }
    );

}


// ========================================
// CLOSE REGISTER
// ========================================

if (closeRegister) {

    closeRegister.addEventListener(
        "click",
        () => {

            registerSection.classList.add(
                "hidden"
            );

        }
    );

}


// ========================================
// REGISTER USER
// ========================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const username =
                document.getElementById(
                    "register-username"
                ).value;


            const email =
                document.getElementById(
                    "register-email"
                ).value;


            const password =
                document.getElementById(
                    "register-password"
                ).value;


            const phone =
                document.getElementById(
                    "register-phone"
                ).value;


            const address =
                document.getElementById(
                    "register-address"
                ).value;


            try {

                const response =
                    await fetch(
                        REGISTER_API_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    username:
                                        username,

                                    email:
                                        email,

                                    password:
                                        password,

                                    phone:
                                        phone,

                                    address:
                                        address

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    console.error(
                        data
                    );


                    alert(
                        JSON.stringify(
                            data
                        )
                    );

                    return;

                }


                alert(
                    "Account created successfully! Please login."
                );


                registerForm.reset();


                registerSection.classList.add(
                    "hidden"
                );


                loginSection.classList.remove(
                    "hidden"
                );


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}


// ========================================
// LOGIN USER
// ========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const username =
                document.getElementById(
                    "login-username"
                ).value;


            const password =
                document.getElementById(
                    "login-password"
                ).value;


            try {

                const response =
                    await fetch(
                        LOGIN_API_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    username:
                                        username,

                                    password:
                                        password

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        "Invalid username or password."
                    );

                    return;

                }


                // Save JWT Tokens

                localStorage.setItem(
                    "access_token",
                    data.access
                );


                localStorage.setItem(
                    "refresh_token",
                    data.refresh
                );


                // Save Username

                localStorage.setItem(
                    "username",
                    username
                );


                alert(
                    "Login successful!"
                );


                loginForm.reset();


                loginSection.classList.add(
                    "hidden"
                );


                updateUserInterface();


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}


// ========================================
// LOGOUT USER
// ========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "access_token"
            );


            localStorage.removeItem(
                "refresh_token"
            );


            localStorage.removeItem(
                "username"
            );


            alert(
                "You have been logged out."
            );


            updateUserInterface();

        }
    );

}

// ========================================
// MY ORDERS
// ========================================

const MY_ORDERS_API_URL =
    "http://127.0.0.1:8000/api/products/my-orders/";

const myOrdersBtn =
    document.getElementById("my-orders-btn");

const myOrdersSection =
    document.getElementById("my-orders-section");

const ordersList =
    document.getElementById("orders-list");

const backFromOrders =
    document.getElementById("back-from-orders");

// ========================================
// SHOW ONLY ONE MAIN SECTION
// ========================================
function showMainSection(sectionId) {
    const sections = [
        "products",
        "product-details",
        "cart",
        "checkout",
        "order-confirmation",
        "my-orders-section",
        "login-section",
        "register-section"
    ];

    sections.forEach(function (id) {
        const section = document.getElementById(id);

        if (section) {
            section.classList.add("hidden");
        }
    });

    const target = document.getElementById(sectionId);

    if (target) {
        target.classList.remove("hidden");
        target.style.display = "";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
// ===============================
// MAIN NAVIGATION
// ===============================

const homeLink = document.getElementById("home-link");
const productsLink = document.getElementById("products-link");
const cartLink = document.getElementById("cart-link");
const shopNowBtn = document.getElementById("shop-now-btn"); 
if (homeLink) {
    homeLink.addEventListener("click", function (event) {
        event.preventDefault();

        showMainSection("products");
    });
}

if (productsLink) {
    productsLink.addEventListener("click", function (event) {
        event.preventDefault();

        showMainSection("products");
    });
}

if (cartLink) {
    cartLink.addEventListener("click", function (event) {
        event.preventDefault();

        showMainSection("cart");
        updateCart();
    });
}

if (shopNowBtn) {
    shopNowBtn.addEventListener("click", function (event) {
        event.preventDefault();

        showMainSection("products");
    });
}

// ========================================
// OPEN MY ORDERS
// ========================================

if (myOrdersBtn) {

    myOrdersBtn.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();

            const token =
                localStorage.getItem("access_token");

            if (!token) {

                alert(
                    "Please login to view your orders."
                );

                return;
            }

            showMainSection(
                "my-orders-section"
            );

            await loadMyOrders();
        }
    );
}

// ========================================
// LOAD MY ORDERS
// ========================================

async function loadMyOrders() {

    const token =
        localStorage.getItem("access_token");

    if (!token) {
        return;
    }

    if (!ordersList) {
        console.error(
            "orders-list element was not found."
        );
        return;
    }

    ordersList.innerHTML = `
        <p class="orders-loading">
            Loading your orders...
        </p>
    `;

    try {

        const response =
            await fetch(
                MY_ORDERS_API_URL,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {

            if (response.status === 401) {

                alert(
                    "Your login session has expired. Please login again."
                );

                localStorage.removeItem(
                    "access_token"
                );

                localStorage.removeItem(
                    "refresh_token"
                );

                localStorage.removeItem(
                    "username"
                );

                updateUserInterface();

                showMainSection("products");

                return;
            }

            const errorText =
                await response.text();

            console.error(
                "My Orders API Error:",
                errorText
            );

            throw new Error(
                "Failed to load orders"
            );
        }

        const orders =
            await response.json();

        console.log(
            "My Orders:",
            orders
        );

        displayMyOrders(orders);

    } catch (error) {

        console.error(
            "My Orders Error:",
            error
        );

        ordersList.innerHTML = `
            <div class="no-orders">
                <h3>Unable to load orders</h3>
                <p>
                    Please make sure you are logged in
                    and Django is running.
                </p>
            </div>
        `;
    }
}

// ========================================
// DISPLAY MY ORDERS
// ========================================

function displayMyOrders(orders) {

    if (!ordersList) {
        return;
    }

    if (!orders || orders.length === 0) {

        ordersList.innerHTML = `
            <div class="no-orders">

                <h3>No orders yet</h3>

                <p>
                    You haven't placed any orders yet.
                </p>

            </div>
        `;

        return;
    }

    ordersList.innerHTML =
        orders.map((order) => {

            const orderItems =
                (order.items || [])
                    .map((item) => {

                        const price =
                            parseFloat(
                                item.price || 0
                            );

                        return `
                            <div class="order-item">

                                <div>

                                    <span
                                        class="order-item-name"
                                    >
                                        ${
                                            item.product_name ||
                                            `Product #${item.product}`
                                        }
                                    </span>

                                    <span
                                        class="order-item-quantity"
                                    >
                                        × ${item.quantity}
                                    </span>

                                </div>

                                <span
                                    class="order-item-price"
                                >
                                    KSH. ${price.toFixed(2)}
                                </span>

                            </div>
                        `;
                    })
                    .join("");

            const orderDate =
                new Date(
                    order.created_at
                ).toLocaleDateString(
                    "en-KE",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );

            return `
                <div class="order-card">

                    <div class="order-card-header">

                        <div>

                            <h3 class="order-number">
                                Order #${order.id}
                            </h3>

                            <span class="order-date">
                                ${orderDate}
                            </span>

                        </div>

                        <span class="order-status">
                            ${order.status}
                        </span>

                    </div>

                    <div class="order-items">

                        ${orderItems}

                    </div>

                    <div class="order-summary">

                        <div class="order-summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                KSH.
                                ${
                                    parseFloat(
                                        order.subtotal || 0
                                    ).toFixed(2)
                                }
                            </span>

                        </div>

                        <div class="order-summary-row">

                            <span>
                                Delivery
                            </span>

                            <span>
                                KSH.
                                ${
                                    parseFloat(
                                        order.delivery_fee || 0
                                    ).toFixed(2)
                                }
                            </span>

                        </div>

                        <div class="order-total-row">

                            <span>
                                Total
                            </span>

                            <span>
                                KSH.
                                ${
                                    parseFloat(
                                        order.total || 0
                                    ).toFixed(2)
                                }
                            </span>

                        </div>

                    </div>

                </div>
            `;

        }).join("");
}

// ========================================
// BACK FROM MY ORDERS
// ========================================

if (backFromOrders) {

    backFromOrders.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            showMainSection("products");

        }
    );
}
// ========================================
// UPDATE USER INTERFACE
// ========================================

function updateUserInterface() {

    const token =
        localStorage.getItem("access_token");

    const username =
        localStorage.getItem("username");

    const loggedIn =
        Boolean(token && username);

    if (loggedIn) {

        // Hide Login
        if (loginBtn) {
            loginBtn.classList.add("hidden");
        }

        // Hide Register
        if (registerBtn) {
            registerBtn.classList.add("hidden");
        }

        // Show Logout
        if (logoutBtn) {
            logoutBtn.classList.remove("hidden");
        }

        // Show username
        if (userDisplay) {

            userDisplay.textContent =
                `Welcome, ${username}`;

            userDisplay.classList.remove("hidden");
        }

        // Show My Orders
        if (myOrdersBtn) {
            myOrdersBtn.classList.remove("hidden");
        }

    } else {

        // Show Login
        if (loginBtn) {
            loginBtn.classList.remove("hidden");
        }

        // Show Register
        if (registerBtn) {
            registerBtn.classList.remove("hidden");
        }

        // Hide Logout
        if (logoutBtn) {
            logoutBtn.classList.add("hidden");
        }

        // Hide username
        if (userDisplay) {
            userDisplay.classList.add("hidden");
        }

        // Hide My Orders
        if (myOrdersBtn) {
            myOrdersBtn.classList.add("hidden");
        }
    }
}


// ========================================
// INITIALIZE WEBSITE
// ========================================

loadProducts();

updateCart();

updateUserInterface();