// Threadloom Knits v2 - small script for menu and enquiry form

// Mobile menu
var btn = document.querySelector(".menu-btn");
var menu = document.getElementById("menu");
if (btn && menu) {
  btn.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
}

// Product data. Later this will come from the database (GET /api/products).
var PRODUCTS = {
  tshirt:  { name: "Basic Crew-Neck T-Shirt", min: 500, price: 165 },
  polo:    { name: "Pique Polo Shirt",        min: 500, price: 245 },
  hoodie:  { name: "Fleece Hoodie",           min: 300, price: 520 },
  uniform: { name: "Corporate Uniform Set",   min: 200, price: 610 },
  kids:    { name: "Kids Round-Neck Tee",     min: 500, price: 120 }
};

var form = document.getElementById("enquiry");
if (form) {
  var product = form.product, qty = form.quantity;
  var estimate = document.getElementById("estimate");
  var error = document.getElementById("error");
  var done = document.getElementById("done");

  function update() {
    var p = PRODUCTS[product.value];
    if (!p) { estimate.textContent = "Choose a product and quantity to see an estimate."; return; }
    qty.min = p.min;
    var n = parseInt(qty.value, 10);
    estimate.textContent = "Minimum order: " + p.min + ". " +
      (n >= p.min ? "Estimate: Rs. " + (n * p.price).toLocaleString("en-IN") + " (Rs. " + p.price + " per piece, before taxes)." : "");
  }
  product.addEventListener("change", update);
  qty.addEventListener("input", update);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    error.textContent = "";
    done.hidden = true;
    if (!form.name.value.trim()) { error.textContent = "Enter your full name."; form.name.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email.value)) { error.textContent = "Enter a valid email address."; form.email.focus(); return; }
    var p = PRODUCTS[product.value], n = parseInt(qty.value, 10);
    if (p && n && n < p.min) { error.textContent = p.name + " has a minimum order of " + p.min + " pieces."; qty.focus(); return; }

    // Backend hook: send the data to the server here, for example
    // fetch("/api/enquiries", { method: "POST", headers: {"Content-Type": "application/json"},
    //   body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    done.hidden = false;
    form.reset();
    update();
  });
}
