// نقرأ السلة المحفوظة
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// نصل إلى عناصر الصفحة
let cartItems = document.getElementById("cartItems");
let cartMessage = document.getElementById("cartMessage");
let cartSummary = document.getElementById("cartSummary");
let subtotalText = document.getElementById("subtotal");
let discountText = document.getElementById("discount");
let totalText = document.getElementById("total");

// تعرض المنتجات وتحسب السعر
function showCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartMessage.textContent = "السلة فارغة. أضيفي منتجًا من صفحة المنتجات.";
        cartSummary.style.display = "none";
        return;
    }

    cartMessage.textContent = "المنتجات في السلة:";
    cartSummary.style.display = "block";

    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let itemTotal = item.price * item.quantity;
        subtotal = subtotal + itemTotal;

        cartItems.innerHTML += `
            <div class="col-12 col-md-6">
                <article class="product-card">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>سعر القطعة: ${item.price} دولار</p>
                    <p>الكمية: ${item.quantity}</p>
                    <p>مجموع المنتج: ${itemTotal} دولار</p>
                    <button class="btn btn-outline-primary" onclick="increaseQuantity(${item.id})">+</button>
                    <button class="btn btn-outline-primary" onclick="decreaseQuantity(${item.id})">-</button>
                    <button class="btn btn-outline-danger" onclick="removeProduct(${item.id})">إزالة</button>
                </article>
            </div>
        `;
    }

    let discount = 0;
    let total = subtotal - discount;

    subtotalText.textContent = subtotal.toFixed(2);
    discountText.textContent = discount.toFixed(2);
    totalText.textContent = total.toFixed(2);
}

// تزيد كمية منتج واحد
function increaseQuantity(productId) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            if (cart[i].quantity < cart[i].stock) {
                cart[i].quantity = cart[i].quantity + 1;
            } else {
                alert("وصلتِ إلى آخر كمية متوفرة.");
            }
        }
    }
    saveCart();
}

// تقلل كمية المنتج، ولا تسمح بأقل من 1
function decreaseQuantity(productId) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            if (cart[i].quantity > 1) {
                cart[i].quantity = cart[i].quantity - 1;
            } else {
                alert("استخدمي زر إزالة لحذف المنتج من السلة.");
            }
        }
    }
    saveCart();
}

// تحذف المنتج من القائمة
function removeProduct(productId) {
    let newCart = [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }

    cart = newCart;
    saveCart();
}

// تحفظ التغييرات ثم تعيد عرض السلة
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
}

// تفريغ السلة بعد سؤال المستخدم
document.getElementById("clearCartButton").addEventListener("click", function () {
    if (confirm("هل أنتِ متأكدة من تفريغ السلة؟")) {
        cart = [];
        saveCart();
    }
});

// لا نسمح بإتمام طلب إذا كانت السلة فارغة
document.getElementById("checkoutLink").addEventListener("click", function (event) {
    if (cart.length === 0) {
        event.preventDefault();
        alert("أضيفي منتجًا قبل إتمام الطلب.");
    }
});

showCart();
