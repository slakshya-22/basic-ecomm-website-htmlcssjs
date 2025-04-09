let dark = false;
let products = [];

function signup() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ email, password }));
  alert("Signup successful! You can now log in.");
  window.location.href = "login.html";
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email && user.password === password) {
    localStorage.setItem("loggedIn", "true");
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials. Please try again.");
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}

function checkAuth() {
  const isProtectedPage =
    location.pathname.includes("index.html") ||
    location.pathname.includes("wishlist.html");

  if (isProtectedPage && !localStorage.getItem("loggedIn")) {
    location.href = "login.html";
  }
}

function toggleMode() {
  dark = !dark;
  document.body.classList.toggle("dark");
}

function loadProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      displayProducts(products);
    });
}

function displayProducts(items) {
  const container =
    document.getElementById("product-list") ||
    document.getElementById("wishlist-items");
  const isWishlistPage = location.pathname.includes("wishlist.html");

  container.innerHTML = "";
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      ${isWishlistPage
        ? `<button onclick="removeFromWishlist(${item.id})">Remove from Wishlist</button>`
        : `<span class="heart" onclick="toggleWishlist(${item.id})">❤</span>`}
      <img src="${item.image}">
      <h4>${item.title}</h4>
      <p>$${item.price}</p>
      <button onclick='viewDetailsById(${item.id})'>View Details</button>
    `;
    container.appendChild(div);
  });
}

function searchProducts() {
  const term = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(term)
  );
  displayProducts(filtered);
}

function filterProducts() {
  const checks = document.querySelectorAll(".sidebar input[type='checkbox']:checked");
  const values = Array.from(checks).map((c) => c.value);

  const min = parseFloat(document.getElementById("min-price").value) || 0;
  const max = parseFloat(document.getElementById("max-price").value) || Infinity;

  const filtered = products.filter((p) => {
    const matchesCategory = values.length ? values.includes(p.category) : true;
    const matchesPrice = p.price >= min && p.price <= max;
    return matchesCategory && matchesPrice;
  });

  displayProducts(filtered);
}

function toggleWishlist(id) {
  let list = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (list.includes(id)) {
    list = list.filter((x) => x !== id);
  } else {
    list.push(id);
  }
  localStorage.setItem("wishlist", JSON.stringify(list));
}

function removeFromWishlist(id) {
  let list = JSON.parse(localStorage.getItem("wishlist")) || [];
  list = list.filter((x) => x !== id);
  localStorage.setItem("wishlist", JSON.stringify(list));
  loadWishlist();
}

function loadWishlist() {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      const ids = JSON.parse(localStorage.getItem("wishlist")) || [];
      const wishItems = data.filter((p) => ids.includes(p.id));
      displayProducts(wishItems);
    });
}

function viewDetailsById(id) {
  const item = products.find((p) => p.id === id);
  if (!item) return;

  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <h2>${item.title}</h2>
    <img src="${item.image}" style="width:100%;height:200px;object-fit:contain;margin-bottom:10px">
    <p><strong>Price:</strong> $${item.price}</p>
    <p>${item.description}</p>
  `;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function goToWishlist() {
  window.location.href = "wishlist.html";
}

function goHome() {
  window.location.href = "index.html";
}

window.onload = function () {
  checkAuth();
  if (location.pathname.includes("index.html")) loadProducts();
  if (location.pathname.includes("wishlist.html")) loadWishlist();
};
