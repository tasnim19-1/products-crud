// نقرأ الطلبات التي حفظناها عند إتمام الشراء
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let ordersList = document.getElementById("ordersList");
let ordersMessage = document.getElementById("ordersMessage");

// نحول اسم الحالة الإنجليزية إلى نص عربي
function showStatus(status) {
    if (status === "Pending") {
        return "قيد الانتظار";
    } else if (status === "Confirmed") {
        return "تم التأكيد";
    } else if (status === "Shipped") {
        return "تم الشحن";
    } else if (status === "Delivered") {
        return "تم التسليم";
    } else if (status === "Cancelled") {
        return "ملغي";
    }

    return status;
}

// تعرض كل الطلبات
function showOrders() {
    ordersList.innerHTML = "";

    if (orders.length === 0) {
        ordersMessage.textContent = "لا توجد طلبات حتى الآن.";
        return;
    }

    ordersMessage.textContent = "عدد الطلبات: " + orders.length;

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let itemsList = "";

        for (let j = 0; j < order.items.length; j++) {
            itemsList += `<li>${order.items[j].name} — الكمية: ${order.items[j].quantity}</li>`;
        }

        ordersList.innerHTML += `
            <article class="order-card">
                <h3>رقم الطلب: ${order.id}</h3>
                <p>التاريخ: ${order.date}</p>
                <p>الحالة: ${showStatus(order.status)}</p>
                <p>الإجمالي: ${Number(order.total).toFixed(2)} دولار</p>
                <details>
                    <summary>تفاصيل الطلب</summary>
                    <p>الاسم: ${order.customer.name}</p>
                    <p>الهاتف: ${order.customer.phone}</p>
                    <p>العنوان: ${order.customer.address}</p>
                    <ul>${itemsList}</ul>
                </details>
            </article>
        `;
    }
}

showOrders();
