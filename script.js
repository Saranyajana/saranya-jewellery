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

  document.getElementById("cartBox").classList.remove("active");

  document.getElementById("customerDetails").scrollIntoView({
    behavior: "smooth",
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
  let total = Number(
    JSON.parse(sessionStorage.getItem("lastOrder") || "null")?.amount,
  );

  if (!Number.isFinite(total) || total <= 0) {
    total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  }

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

let selectedCategory = "all";

function filterProducts(category) {
  selectedCategory = category;
  applyProductFilters();

  document.getElementById("products").scrollIntoView({
    behavior: "smooth",
  });
}

function applyProductFilters() {
  const products = Array.from(document.querySelectorAll(".product-card"));

  const searchInput = document.getElementById("productSearch");
  const priceSelect = document.getElementById("priceFilter");
  const sortSelect = document.getElementById("productSort");

  const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const selectedPrice = priceSelect ? priceSelect.value : "all";
  const sortValue = sortSelect ? sortSelect.value : "default";

  products.sort(function (a, b) {
    const nameA = a.querySelector("h3").textContent.trim();
    const nameB = b.querySelector("h3").textContent.trim();

    const priceA = Number(
      a.querySelector("h4").textContent.replace(/[^\d.]/g, ""),
    );
    const priceB = Number(
      b.querySelector("h4").textContent.replace(/[^\d.]/g, ""),
    );

    if (sortValue === "name-asc") {
      return nameA.localeCompare(nameB);
    }

    if (sortValue === "name-desc") {
      return nameB.localeCompare(nameA);
    }

    if (sortValue === "price-low") {
      return priceA - priceB;
    }

    if (sortValue === "price-high") {
      return priceB - priceA;
    }

    return 0;
  });

  const container = document.querySelector(".product-container");
  let visibleCount = 0;

  products.forEach(function (product) {
    const name = product.querySelector("h3").textContent.toLowerCase();
    const description = product.querySelector("p").textContent.toLowerCase();

    const matchesCategory =
      selectedCategory === "all" ||
      product.classList.contains(selectedCategory);

    const matchesSearch =
      name.includes(searchText) || description.includes(searchText);

    const price = Number(
      product.querySelector("h4").textContent.replace(/[^\d.]/g, ""),
    );

    const matchesPrice =
      selectedPrice === "all" || price === Number(selectedPrice);

    const isVisible = matchesCategory && matchesSearch && matchesPrice;

    product.hidden = !isVisible;

    if (isVisible) {
      visibleCount++;
    }

    container.appendChild(product);
  });

  const resultCount = document.getElementById("productResultCount");

  if (resultCount) {
    resultCount.textContent =
      visibleCount +
      (visibleCount === 1 ? " product found" : " products found");
  }
}

document
  .getElementById("productSearch")
  ?.addEventListener("input", applyProductFilters);

document
  .getElementById("priceFilter")
  ?.addEventListener("change", applyProductFilters);

document
  .getElementById("productSort")
  ?.addEventListener("change", applyProductFilters);

applyProductFilters();

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
        },
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

      document.getElementById("paymentAmount").innerText =
        "₹" + savedOrder.totalAmount;

      cart = [];
      updateCart();
      document.getElementById("customerForm").reset();

      window.location.href =
        "order-confirmation.html?orderId=" + encodeURIComponent(savedOrder.id);
    } catch (error) {
      alert("Order failed to submit. Please check the backend and try again.");
      console.error(error);
    }
  });

let selectedReviewProduct = "";

function openReviewForm(button) {
  const productCard = button.closest(".product-card");

  if (!productCard) {
    alert("Product details not found.");
    return;
  }

  selectedReviewProduct =
    productCard.querySelector("h3")?.textContent.trim() ||
    productCard.dataset.name ||
    "Product";

  document.getElementById("reviewForm").reset();
  document.getElementById("reviewModal").style.display = "flex";
}

function closeReviewForm() {
  document.getElementById("reviewModal").style.display = "none";
  selectedReviewProduct = "";
}

document
  .getElementById("cancelReview")
  .addEventListener("click", closeReviewForm);

document
  .getElementById("reviewModal")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      closeReviewForm();
    }
  });
async function loadProductReviews() {
  const productCards = document.querySelectorAll(".product-card");

  for (const card of productCards) {
    const productName = card.querySelector("h3")?.textContent.trim();

    const ratingSection = card.querySelector(".product-rating");

    if (!productName || !ratingSection) continue;

    try {
      const response = await fetch(
        `https://jewellery-backend-as8i.onrender.com/api/reviews/${encodeURIComponent(productName)}`,
      );

      if (!response.ok) continue;

      const reviews = await response.json();

      if (reviews.length === 0) {
        ratingSection.querySelector(".rating-stars").textContent = "☆☆☆☆☆";
        ratingSection.querySelector(".rating-text").textContent =
          "No reviews yet";
        continue;
      }

      const average =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;

      ratingSection.querySelector(".rating-stars").textContent =
        "★".repeat(Math.round(average)) + "☆".repeat(5 - Math.round(average));

      ratingSection.querySelector(".rating-text").textContent =
        `${average.toFixed(1)} (${reviews.length} review${reviews.length === 1 ? "" : "s"})`;
      let reviewContainer = card.querySelector(".customer-reviews");

      if (!reviewContainer) {
        reviewContainer = document.createElement("div");
        reviewContainer.className = "customer-reviews";
        card.appendChild(reviewContainer);
      }

      reviewContainer.replaceChildren();

      reviews.slice(0, 3).forEach((review) => {
        const reviewItem = document.createElement("div");
        reviewItem.className = "customer-review-item";

        const name = document.createElement("strong");
        name.textContent = review.customerName;

        const text = document.createElement("p");
        text.textContent = review.reviewText || "No written comment.";

        reviewItem.append(name, text);
        reviewContainer.appendChild(reviewItem);
      });
    } catch (error) {
      console.error(`Could not load reviews for ${productName}:`, error);
    }
  }
}

document
  .getElementById("reviewForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const customerName = document
      .getElementById("reviewCustomerName")
      .value.trim();

    const rating = Number(document.getElementById("reviewRating").value);

    const reviewText = document.getElementById("reviewText").value.trim();

    if (!selectedReviewProduct || !customerName || !rating || !reviewText) {
      alert("Please enter your name, select a rating and write a review.");
      return;
    }

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
      const response = await fetch(
        "https://jewellery-backend-as8i.onrender.com/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: selectedReviewProduct,
            customerName,
            rating,
            reviewText,
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();

        if (response.status === 409) {
          throw new Error("This review has already been submitted.");
        }

        if (response.status === 400) {
          throw new Error("Please check your name, rating and review.");
        }

        if (response.status === 429) {
          throw new Error("Too many submissions. Please try again later.");
        }

        throw new Error(
          `Review submission failed (${response.status}). ${errorBody}`,
        );
      }

      alert("Review submitted successfully!");
      closeReviewForm();
      await loadProductReviews();
    } catch (error) {
      console.error("Review submission error:", error);
      alert(error.message || "Could not submit the review. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Review";
    }
  });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProductReviews);
} else {
  loadProductReviews();
}
