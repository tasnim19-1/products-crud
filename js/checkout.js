// نقرأ السلة والمخزون والطلبات
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// نصل إلى عناصر الصفحة
let checkoutForm = document.getElementById("checkoutForm");
let checkoutMessage = document.getElementById("checkoutMessage");
let reviewSection = document.getElementById("reviewSection");
let reviewDetails = document.getElementById("reviewDetails");
let confirmButton = document.getElementById("confirmButton");
let successSection = document.getElementById("successSection");
let orderTotal = 0;

// إذا كانت السلة فارغة لا نعرض نموذج الطلب
if (cart.length === 0) {
    checkoutForm.hidden = true;
    checkoutMessage.textContent = "السلة فارغة. أضيفي منتجًا قبل إتمام الطلب.";
} else {
    showOrderSummary();
}

// تعرض هذه الدالة المنتجات ومجموع الأسعار
function showOrderSummary() {
    let checkoutItems = document.getElementById("checkoutItems");
    checkoutItems.innerHTML = "";
    orderTotal = 0;

    for (let i = 0; i < cart.length; i++) {
        let itemPrice = cart[i].price * cart[i].quantity;
        orderTotal = orderTotal + itemPrice;
        checkoutItems.innerHTML += `<p>${cart[i].name} — العدد: ${cart[i].quantity} — ${itemPrice} دولار</p>`;
    }

    document.getElementById("checkoutSubtotal").textContent = orderTotal.toFixed(2);
    document.getElementById("checkoutDiscount").textContent = "0.00";
    document.getElementById("checkoutTotal").textContent = orderTotal.toFixed(2);
}

// بعد تعبئة البيانات نظهر مراجعة قبل التأكيد
checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let customerName = document.getElementById("customerName").value;
    let customerPhone = document.getElementById("customerPhone").value;
    let customerAddress = document.getElementById("customerAddress").value;

    if (customerName === "" || customerPhone === "" || customerAddress === "") {
        checkoutMessage.textContent = "يجب تعبئة جميع الحقول.";
        return;
    }

    reviewDetails.innerHTML = `
        <p>الاسم: ${customerName}</p>
        <p>الهاتف: ${customerPhone}</p>
        <p>العنوان: ${customerAddress}</p>
        <p>الإجمالي: ${orderTotal.toFixed(2)} دولار</p>
    `;

    reviewSection.hidden = false;
});

// عند التأكيد نحفظ الطلب ونخصم الكمية من المخزون
confirmButton.addEventListener("click", function () {
    // نتأكد أن المخزون يكفي
    for (let i = 0; i < cart.length; i++) {
        let available = inventory[cart[i].id];

        if (available === undefined) {
            available = cart[i].stock;
        }

        if (cart[i].quantity > available) {
            checkoutMessage.textContent = "الكمية المطلوبة لم تعد متوفرة. ارجعي إلى السلة.";
            return;
        }
    }

    confirmButton.disabled = true;

    // ننقص كمية كل منتج من المخزون
    for (let i = 0; i < cart.length; i++) {
        let available = inventory[cart[i].id];

        if (available === undefined) {
            available = cart[i].stock;
        }

        inventory[cart[i].id] = available - cart[i].quantity;
    }

    let orderNumber = "ORD-" + new Date().getTime();
    let newOrder = {
        id: orderNumber,
        customer: {
            name: document.getElementById("customerName").value,
            phone: document.getElementById("customerPhone").value,
            address: document.getElementById("customerAddress").value
        },
        items: cart,
        total: orderTotal,
        date: new Date().toLocaleDateString(),
        status: "Pending"
    };

    orders.push(newOrder);

    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("cart", JSON.stringify([]));

    document.getElementById("newOrderNumber").textContent = orderNumber;
    checkoutForm.hidden = true;
    reviewSection.hidden = true;
    successSection.hidden = false;
});
