// نقرأ المنتجات والطلبات والمخزون المحفوظ
let products = JSON.parse(localStorage.getItem("products"));
if (products === null) {
    products = defaultProducts;
}

let orders = JSON.parse(localStorage.getItem("orders")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

// نضيف المنتجات الابتدائية التي قد لا تكون موجودة في القائمة المحفوظة
for (let i = 0; i < defaultProducts.length; i++) {
    let productFound = false;

    for (let j = 0; j < products.length; j++) {
        if (products[j].id === defaultProducts[i].id) {
            productFound = true;
        }
    }

    if (productFound === false) {
        products.push(defaultProducts[i]);
    }
}

// نقرأ كمية المخزون الحالية لكل منتج
for (let i = 0; i < products.length; i++) {
    if (inventory[products[i].id] !== undefined) {
        products[i].stock = inventory[products[i].id];
    }
    if (products[i].active === undefined) {
        products[i].active = true;
    }
}

localStorage.setItem("products", JSON.stringify(products));

// نصل إلى عناصر الصفحة
let productForm = document.getElementById("productForm");
let adminProducts = document.getElementById("adminProducts");
let productMessage = document.getElementById("productMessage");
let adminOrders = document.getElementById("adminOrders");
let adminMessage = document.getElementById("adminMessage");
let orderSearch = document.getElementById("orderSearch");
let statuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

// تحفظ هذه الدالة المنتجات والمخزون
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// تحويل الحالة الإنجليزية إلى العربية
function statusName(status) {
    if (status === "Pending") return "قيد الانتظار";
    if (status === "Confirmed") return "تم التأكيد";
    if (status === "Shipped") return "تم الشحن";
    if (status === "Delivered") return "تم التسليم";
    if (status === "Cancelled") return "ملغي";
    return status;
}

// تحديث الأرقام المختصرة أعلى لوحة الإدارة
function updateDashboard() {
    document.getElementById("productCount").textContent = products.length;
    document.getElementById("orderCount").textContent = orders.length;

    let lowStockCount = 0;
    for (let i = 0; i < products.length; i++) {
        if (products[i].active && products[i].stock <= 2) {
            lowStockCount = lowStockCount + 1;
        }
    }
    document.getElementById("lowStockCount").textContent = lowStockCount;

    let salesTotal = 0;
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].status !== "Cancelled") {
            salesTotal = salesTotal + Number(orders[i].total);
        }
    }
    document.getElementById("salesTotal").textContent = salesTotal.toFixed(2);

    showStatusChart();
}

// رسم بسيط لعدد الطلبات في كل حالة
function showStatusChart() {
    let statusChart = document.getElementById("statusChart");
    statusChart.innerHTML = "";

    for (let i = 0; i < statuses.length; i++) {
        let count = 0;

        for (let j = 0; j < orders.length; j++) {
            if (orders[j].status === statuses[i]) {
                count = count + 1;
            }
        }

        let barWidth = 0;
        if (orders.length > 0) {
            barWidth = (count / orders.length) * 100;
        }

        statusChart.innerHTML += `
            <div class="chart-row">
                <span>${statusName(statuses[i])} (${count})</span>
                <div class="chart-track"><div class="chart-bar" style="width: ${barWidth}%"></div></div>
            </div>
        `;
    }
}

// عرض جميع المنتجات في جدول الإدارة
function showProductsTable() {
    adminProducts.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        let activeText = "نشط";
        let toggleText = "تعطيل";

        if (products[i].active === false) {
            activeText = "معطل";
            toggleText = "تفعيل";
        }

        adminProducts.innerHTML += `
            <tr>
                <td>${products[i].name}</td>
                <td>${products[i].category}</td>
                <td>${products[i].price} دولار</td>
                <td>${products[i].stock}</td>
                <td>${activeText}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editProduct(${products[i].id})">تعديل</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="changeProductActive(${products[i].id})">${toggleText}</button>
                </td>
            </tr>
        `;
    }
}

// إضافة منتج جديد أو حفظ التعديلات
productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let editId = document.getElementById("editProductId").value;
    let productName = document.getElementById("productName").value;
    let productCategory = document.getElementById("productCategory").value;
    let productPrice = Number(document.getElementById("productPrice").value);
    let productDescription = document.getElementById("productDescription").value;
    let productImage = document.getElementById("productImage").value;
    let productStock = Number(document.getElementById("productStock").value);

    if (productName === "" || productPrice <= 0 || productStock < 0 || productStock % 1 !== 0) {
        productMessage.textContent = "تحققي من الاسم والسعر والكمية.";
        return;
    }

    if (editId === "") {
        // نضيف منتجًا جديدًا إلى نهاية المصفوفة
        let newId = products.length + 1;
        let newProduct = {
            id: newId,
            name: productName,
            category: productCategory,
            price: productPrice,
            description: productDescription,
            image: productImage,
            stock: productStock,
            active: true
        };
        products.push(newProduct);
        productMessage.textContent = "تمت إضافة المنتج.";
    } else {
        // نبحث عن المنتج الذي نريد تعديله
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === Number(editId)) {
                products[i].name = productName;
                products[i].category = productCategory;
                products[i].price = productPrice;
                products[i].description = productDescription;
                products[i].image = productImage;
                products[i].stock = productStock;
                inventory[products[i].id] = productStock;
            }
        }
        productMessage.textContent = "تم تعديل المنتج.";
    }

    saveProducts();
    resetProductForm();
    showProductsTable();
    updateDashboard();
});

// تعبئة النموذج ببيانات المنتج الذي نريد تعديله
function editProduct(productId) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            document.getElementById("editProductId").value = products[i].id;
            document.getElementById("productName").value = products[i].name;
            document.getElementById("productCategory").value = products[i].category;
            document.getElementById("productPrice").value = products[i].price;
            document.getElementById("productDescription").value = products[i].description;
            document.getElementById("productImage").value = products[i].image;
            document.getElementById("productStock").value = products[i].stock;
            document.getElementById("saveProductButton").textContent = "حفظ التعديل";
            document.getElementById("cancelEditButton").hidden = false;
        }
    }
}

// تعطيل المنتج أو تفعيله من جديد
function changeProductActive(productId) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            if (confirm("هل تريدين تغيير حالة هذا المنتج؟")) {
                products[i].active = !products[i].active;
                saveProducts();
                showProductsTable();
                updateDashboard();
                productMessage.textContent = "تم تحديث حالة المنتج.";
            }
        }
    }
}

// إعادة النموذج إلى وضع إضافة منتج جديد
function resetProductForm() {
    productForm.reset();
    document.getElementById("editProductId").value = "";
    document.getElementById("productImage").value = "images/phone.svg";
    document.getElementById("saveProductButton").textContent = "إضافة المنتج";
    document.getElementById("cancelEditButton").hidden = true;
}

document.getElementById("cancelEditButton").addEventListener("click", function () {
    resetProductForm();
});

// الحالات المسموح الانتقال إليها للطلب
function showNextStatuses(status) {
    if (status === "Pending") return ["Confirmed", "Cancelled"];
    if (status === "Confirmed") return ["Shipped", "Cancelled"];
    if (status === "Shipped") return ["Delivered"];
    return [];
}

// البحث وعرض الطلبات
function showOrders() {
    let searchText = orderSearch.value.toLowerCase();
    adminOrders.innerHTML = "";
    let ordersShown = 0;

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let idMatches = order.id.toLowerCase().indexOf(searchText) !== -1;
        let nameMatches = order.customer.name.toLowerCase().indexOf(searchText) !== -1;

        if (idMatches || nameMatches) {
            ordersShown = ordersShown + 1;
            let nextStatuses = showNextStatuses(order.status);
            let buttons = "";

            for (let j = 0; j < nextStatuses.length; j++) {
                buttons += `<button class="btn btn-sm btn-outline-primary" onclick="changeOrderStatus('${order.id}', '${nextStatuses[j]}')">${statusName(nextStatuses[j])}</button> `;
            }

            if (buttons === "") {
                buttons = "لا يوجد تغيير آخر لهذه الحالة.";
            }

            adminOrders.innerHTML += `
                <article class="order-card">
                    <h3>رقم الطلب: ${order.id}</h3>
                    <p>العميل: ${order.customer.name}</p>
                    <p>التاريخ: ${order.date}</p>
                    <p>الحالة: ${statusName(order.status)}</p>
                    <p>الإجمالي: ${order.total} دولار</p>
                    ${buttons}
                </article>
            `;
        }
    }

    if (ordersShown === 0) {
        if (orders.length === 0) {
            adminMessage.textContent = "لا توجد طلبات حتى الآن.";
        } else {
            adminMessage.textContent = "لا توجد طلبات تطابق البحث.";
        }
    } else {
        adminMessage.textContent = "عدد الطلبات المعروضة: " + ordersShown;
    }
}

// تغيير حالة الطلب وإرجاع المخزون إذا أُلغي
function changeOrderStatus(orderId, newStatus) {
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            let allowedStatuses = showNextStatuses(orders[i].status);
            let statusIsAllowed = false;

            for (let j = 0; j < allowedStatuses.length; j++) {
                if (allowedStatuses[j] === newStatus) {
                    statusIsAllowed = true;
                }
            }

            if (statusIsAllowed === false) {
                alert("هذا التغيير غير مسموح.");
                return;
            }

            if (confirm("هل تريدين تغيير حالة الطلب؟")) {
                if (newStatus === "Cancelled" && orders[i].inventoryRestored !== true) {
                    for (let j = 0; j < orders[i].items.length; j++) {
                        let item = orders[i].items[j];
                        let currentStock = inventory[item.id];

                        if (currentStock === undefined) {
                            currentStock = item.stock;
                        }

                        inventory[item.id] = currentStock + item.quantity;

                        for (let k = 0; k < products.length; k++) {
                            if (products[k].id === item.id) {
                                products[k].stock = inventory[item.id];
                            }
                        }
                    }
                    orders[i].inventoryRestored = true;
                    localStorage.setItem("inventory", JSON.stringify(inventory));
                }

                orders[i].status = newStatus;
                saveOrders();
                saveProducts();
                updateDashboard();
                showOrders();
                adminMessage.textContent = "تم تحديث حالة الطلب.";
            }
        }
    }
}

// عند الكتابة في البحث نعرض النتائج الجديدة
orderSearch.addEventListener("input", showOrders);

// أول عرض للبيانات عند فتح لوحة الإدارة
showProductsTable();
updateDashboard();
showOrders();
