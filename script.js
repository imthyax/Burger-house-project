let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedCoupon = localStorage.getItem("coupon") || "";


// ================= SAVE CART =================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ================= GET CART TOTAL =================

function getCartTotal() {

    let total = 0;

    cart.forEach(function(item) {

        total += item.price * item.quantity;

    });

    return total;

}


// ================= CHECK FREE OFFER ITEMS =================

function updateFreeOffers() {

    // First remove all old free offer items

    cart = cart.filter(function(item) {

        return (
            item.name !== "Crispy Chicken Burger (FREE)" &&
            item.name !== "Blueberry Mojitto (FREE)" &&
            item.name !== "Coca Cola (FREE)"
        );

    });


    let total = getCartTotal();

    let burger = cart.find(function(item) {

        return item.name === "Crispy Chicken Burger";

    });


    // B1G1: Buy 1 Burger, get 1 free Burger

    if (
        selectedCoupon === "B1G1" &&
        burger &&
        burger.quantity >= 1
    ) {

        cart.push({

            name: "Crispy Chicken Burger (FREE)",
            price: 0,
            quantity: 1

        });

    }


    // WEEKEND: Buy 2 Burgers, get 1 free Burger

    if (
        selectedCoupon === "WEEKEND" &&
        burger &&
        burger.quantity >= 2
    ) {

        cart.push({

            name: "Crispy Chicken Burger (FREE)",
            price: 0,
            quantity: 1

        });

    }


    // FREEMOJITO: Cart must stay ₹499 or more

    if (
        selectedCoupon === "FREEMOJITO" &&
        total >= 499
    ) {

        cart.push({

            name: "Blueberry Mojitto (FREE)",
            price: 0,
            quantity: 1

        });

    }


    // FREECOKE: Cart must stay ₹499 or more

    if (
        selectedCoupon === "FREECOKE" &&
        total >= 499
    ) {

        cart.push({

            name: "Coca Cola (FREE)",
            price: 0,
            quantity: 1

        });

    }

}


// ================= ADD TO CART =================

const buttons = document.querySelectorAll(".add-cart");

buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        let name = button.dataset.name;
        let price = Number(button.dataset.price);

        let existingItem = cart.find(function(item) {

            return item.name === name;

        });

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({

                name: name,
                price: price,
                quantity: 1

            });

        }

        updateFreeOffers();
        saveCart();

        showMessage(name + " added to cart!");

        updateCart();

    });

});


// ================= MESSAGE =================

function showMessage(text) {

    let message = document.getElementById("message");

    if (!message) return;

    message.innerHTML = text;

    message.style.display = "block";

    setTimeout(function() {

        message.style.display = "none";

    }, 2000);

}


// ================= UPDATE CART SCREEN =================

function updateCart() {

    let cartBox = document.getElementById("cart-box");
    let cartCount = document.getElementById("cart-count");

    if (!cartBox || !cartCount) return;

    let count = 0;
    let total = 0;

    cartBox.innerHTML = "";

    cart.forEach(function(item) {

        count += item.quantity;

        total += item.price * item.quantity;

    });

    cartCount.innerHTML = count;


    if (cart.length === 0) {

        cartBox.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
            </div>
        `;

        return;

    }


    cart.forEach(function(item) {

        cartBox.innerHTML += `

            <div class="cart-item">

                <h3>${item.name}</h3>

                <p>Price: ₹${item.price}</p>

                <div class="quantity">

                    <span>Quantity:</span>

                    ${
                        item.price === 0
                        ?
                        `<span>${item.quantity}</span>`
                        :
                        `
                        <button onclick="decreaseQuantity('${item.name}')">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="increaseQuantity('${item.name}')">
                            +
                        </button>
                        `
                    }

                </div>

                <button onclick="removeItem('${item.name}')">
                    Remove
                </button>

            </div>

        `;

    });


    cartBox.innerHTML += `

        <div class="cart-total">

            <h3>Total: ₹${total}</h3>

            <button onclick="checkout()">
                Checkout
            </button>

            <button onclick="closeCart()">
                Close Cart
            </button>

        </div>

    `;

}


// ================= PLUS =================

function increaseQuantity(name) {

    let item = cart.find(function(item) {

        return item.name === name;

    });

    if (item) {

        item.quantity++;

    }

    updateFreeOffers();
    saveCart();
    updateCart();

}


// ================= MINUS =================

function decreaseQuantity(name) {

    let item = cart.find(function(item) {

        return item.name === name;

    });

    if (item) {

        if (item.quantity > 1) {

            item.quantity--;

        } else {

            cart = cart.filter(function(item) {

                return item.name !== name;

            });

        }

    }

    updateFreeOffers();
    saveCart();
    updateCart();

}


// ================= REMOVE =================

function removeItem(name) {

    cart = cart.filter(function(item) {

        return item.name !== name;

    });

    updateFreeOffers();
    saveCart();
    updateCart();

}


// ================= OPEN CART =================

let cartIcon = document.getElementById("cart-icon");

if (cartIcon) {

    cartIcon.addEventListener("click", function() {

        let cartBox = document.getElementById("cart-box");

        if (cartBox) {

            cartBox.style.display = "block";

            updateCart();

        }

    });

}


// ================= CLOSE CART =================

function closeCart() {

    let cartBox = document.getElementById("cart-box");

    if (cartBox) {

        cartBox.style.display = "none";

    }

}


// ================= CHECKOUT =================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    window.location.href = "checkout.html";

}


// ================= CHECKOUT TOTAL =================

function showCheckoutTotal() {

    let total = getCartTotal();

    let discount = calculateDiscount(total);

    let finalTotal = total - discount;

    let checkoutTotal =
        document.getElementById("checkout-total");

    if (checkoutTotal) {

        checkoutTotal.innerHTML = `
            <div class="summary-line">
                <span>Subtotal:</span>
                <span>₹${total}</span>
            </div>
            <div class="summary-line discount-line">
                <span>Discount:</span>
                <span>- ₹${discount}</span>
            </div>
            <div class="summary-line total-line">
                <span>Total Payable:</span>
                <span class="total-amount">₹${finalTotal}</span>
            </div>
        `;

    }

    // Update UPI QR code with dynamic order amount if QR image exists
    let qrImage = document.getElementById("upi-qr-image");
    if (qrImage) {
        let upiId = "7019736315@ybl";
        let payeeName = encodeURIComponent("BurgerHouse");
        let upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${finalTotal}&cu=INR`;
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUrl)}`;
    }

}


// ================= PAYMENT METHOD HANDLER =================

function onPaymentMethodChange(radio) {

    let allCards = document.querySelectorAll(".payment-option-card");
    allCards.forEach(function(card) {
        card.classList.remove("active");
    });

    if (radio && radio.closest(".payment-option-card")) {
        radio.closest(".payment-option-card").classList.add("active");
    }

    let upiBox = document.getElementById("upi-details-box");
    if (upiBox) {
        if (radio.value === "UPI") {
            upiBox.style.display = "block";
        } else {
            upiBox.style.display = "none";
        }
    }

}


// ================= COPY UPI ID =================

function copyUPI() {

    let upiId = "7019736315@ybl";
    let copyBtn = document.getElementById("copy-btn");

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(upiId).then(function() {
            showCopySuccess(copyBtn);
        }).catch(function() {
            fallbackCopy(upiId, copyBtn);
        });
    } else {
        fallbackCopy(upiId, copyBtn);
    }

}

function fallbackCopy(text, btn) {
    let tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand("copy");
        showCopySuccess(btn);
    } catch (err) {
        alert("UPI ID: " + text);
    }
    document.body.removeChild(tempInput);
}

function showCopySuccess(btn) {
    if (!btn) return;
    let originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    btn.classList.add("copied");

    setTimeout(function() {
        btn.innerHTML = originalHtml;
        btn.classList.remove("copied");
    }, 2000);
}



// ================= PLACE ORDER =================

function placeOrder() {

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    let payment = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (
        name === "" ||
        phone === "" ||
        address === "" ||
        payment === null
    ) {

        alert("Please fill all details.");

        return;

    }

    if (phone.length !== 10) {

        alert("Please enter a valid 10-digit phone number.");

        return;

    }

    let total = getCartTotal();

    let discount = calculateDiscount(total);

    let finalTotal = total - discount;

    localStorage.setItem("customerName", name);
    localStorage.setItem("customerPhone", phone);
    localStorage.setItem("customerAddress", address);
    localStorage.setItem("paymentMethod", payment.value);

    localStorage.setItem("orderTotal", finalTotal);
    localStorage.setItem("discount", discount);

    cart = [];

    saveCart();

    localStorage.removeItem("coupon");

    selectedCoupon = "";

    alert("Order placed successfully!");

    window.location.href = "success.html";

}


// ================= APPLY COUPON =================

function applyCoupon(code) {

    let total = getCartTotal();

    let burger = cart.find(function(item) {

        return item.name === "Crispy Chicken Burger";

    });


    if (code === "B1G1" && !burger) {

        alert("Please add Crispy Chicken Burger to your cart first.");

        return;

    }


    if (
        code === "WEEKEND" &&
        (!burger || burger.quantity < 2)
    ) {

        alert(
            "Weekend Special: Buy 2 Crispy Chicken Burgers and get 1 FREE!"
        );

        return;

    }


    if (
        (code === "FREEMOJITO" || code === "FREECOKE") &&
        total < 499
    ) {

        alert("This offer is available on orders above ₹499.");

        return;

    }


    if (code === "BURGER30" && total < 299) {

        alert("BURGER30 is available on orders above ₹299.");

        return;

    }


    if (code === "SAVE100" && total < 699) {

        alert("SAVE100 is available on orders above ₹699.");

        return;

    }


    selectedCoupon = code;

    localStorage.setItem("coupon", code);

    updateFreeOffers();
    saveCart();
    updateCart();

    alert("Coupon " + code + " applied!");

}


// ================= CALCULATE DISCOUNT =================

function calculateDiscount(total) {

    let discount = 0;

    if (
        selectedCoupon === "BURGER30" &&
        total >= 299
    ) {

        discount = total * 0.30;

    }

    else if (selectedCoupon === "NEW20") {

        discount = total * 0.20;

    }

    else if (
        selectedCoupon === "SAVE100" &&
        total >= 699
    ) {

        discount = 100;

    }

    else if (selectedCoupon === "INDIA15") {

        discount = total * 0.15;

    }

    return discount;

}


// ================= RUN WHEN PAGE LOADS =================

updateFreeOffers();
saveCart();

updateCart();

showCheckoutTotal();