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