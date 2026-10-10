let cart = [];

function addToCart(productName, price) {
  cart.push({
    name: productName,
    price: price,
  });

  updateCart();

  alert(productName + " added to cart!");
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `
            <strong>${item.name}</strong>
            <p>₹${item.price}</p>

            <button onclick="removeFromCart(${index})">
                Remove
            </button>
        `;

    cartItems.appendChild(div);
  });

  cartCount.innerText = cart.length;

  cartTotal.innerText = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);

  updateCart();
}

function openCart() {
  document.getElementById("cartBox").classList.add("active");
}

function closeCart() {
  document.getElementById("cartBox").classList.remove("active");
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  document.getElementById("paymentAmount").innerText = "₹" + total;

  const customerDetails = document.getElementById("customerDetails");

  if (!customerDetails) {
    alert("Customer Details section not found!");
    return;
  }

  document.getElementById("cartBox").classList.remove("active");

  window.location.hash = "customerDetails";

  window.scrollTo({
    top: customerDetails.offsetTop - 100,
    behavior: "instant",
  });
}

function enquire(productName) {
  const phoneNumber = "918608411443";

  const message =
    "Hello Saranya Jewellery! 👋\n\n" +
    "I am interested in: " +
    productName +
    "\n\nPlease share more details.";

  const whatsappURL =
    "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);

  window.open(whatsappURL, "_blank");
}

function generalEnquiry() {
  const phoneNumber = "918608411443";

  const message =
    "Hello Saranya Jewellery! 👋\n\n" +
    "I would like to know more about your jewellery collection.";

  const whatsappURL =
    "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);

  window.open(whatsappURL, "_blank");
}

function startPayment() {
  alert(
    "Payment section opened.\n\n" + "This is currently a demo payment flow.",
  );
}

// ================= QR PAYMENT =================

const upiId = "janasaranya45@okicici";

function generatePaymentQR() {
  let total = 0;

  cart.forEach(function (item) {
    total += Number(item.price);
  });

  if (total <= 0) {
    total = 1;
  }

  const qrContainer = document.getElementById("qrcode");

  if (!qrContainer) {
    console.log("QR container not found");
    return;
  }

  qrContainer.innerHTML = "";

  const upiLink =
    "upi://pay?pa=" +
    encodeURIComponent(upiId) +
    "&pn=" +
    encodeURIComponent("Saranya Jewellery") +
    "&am=" +
    total +
    "&cu=INR";

  new QRCode(qrContainer, {
    text: upiLink,
    width: 200,
    height: 200,
  });

  const amountElement = document.getElementById("paymentAmount");

  if (amountElement) {
    amountElement.innerText = "₹" + total;
  }
}

function filterProducts(category) {
  const products = document.querySelectorAll(".product-card");

  products.forEach(function (product) {
    if (category === "all" || product.classList.contains(category)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });

  document.getElementById("products").scrollIntoView({
    behavior: "smooth",
  });
}

document
  .getElementById("customerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Please add a product to your cart first!");
      return;
    }

    const customerName = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();

    const order = {
      customerName: customerName,
      phone: phone,
      address: address,
      productNames: cart.map((item) => item.name).join(", "),
      totalAmount: cart.reduce((total, item) => total + Number(item.price), 0),
    };

 
try {
  const response = await fetch(
    "https://jewellery-backend-as8i.onrender.com/api/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }
  );

  if (!response.ok) {
    throw new Error("Order could not be saved.");
  }

  const savedOrder = await response.json();

  const orderDetails = {
    id: savedOrder.id,
    amount: savedOrder.totalAmount,
  };


      sessionStorage.setItem("lastOrder", JSON.stringify(orderDetails));

      window.location.href =
        "order-confirmation.html?orderId=" + encodeURIComponent(savedOrder.id);

      // Open the order tracking page
      const trackButton = confirm("Would you like to track your order now?");

      if (trackButton) {
        window.location.href =
          "track-order.html?orderId=" + encodeURIComponent(savedOrder.id);
      }

      cart = [];
      updateCart();
      document.getElementById("customerForm").reset();

      cart = [];
      updateCart();
      document.getElementById("customerForm").reset();
    } catch (error) {
      alert("Order failed to submit. Please check the backend and try again.");
      console.error(error);
    }
  });
