// 1) نقرأ المنتجات من ذاكرة المتصفح
// إذا لم نجد منتجات محفوظة، نستخدم المنتجات الموجودة في product-data.js
let products = JSON.parse(localStorage.getItem("products"));

if (products === null) {
    products = defaultProducts;
}

// نقرأ المخزون الذي حفظناه بعد الطلبات
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

// نمر على المنتجات واحدًا واحدًا ونحدّث مخزونها
for (let i = 0; i < products.length; i++) {
    if (inventory[products[i].id] !== undefined) {
        products[i].stock = inventory[products[i].id];
    }
}

// 2) نمسك عناصر HTML حتى نستطيع استخدامها وتغييرها
let productsList = document.getElementById("productsList");
let searchInput = document.getElementById("searchInput");
let categorySelect = document.getElementById("categorySelect");
let sortSelect = document.getElementById("sortSelect");
let productsMessage = document.getElementById("productsMessage");
let clearButton = document.getElementById("clearFilters");

// 3) دالة تعرض قائمة المنتجات التي نستقبلها
function showProducts(productsToShow) {
    // نفرغ المكان قبل العرض، حتى لا تتكرر البطاقات
    productsList.innerHTML = "";

    // إذا كانت القائمة فارغة، نعرض رسالة ونوقف الدالة
    if (productsToShow.length === 0) {
        productsMessage.textContent = "لا توجد منتجات مطابقة.";
        return;
    }

    // نعرض عدد المنتجات الموجودة
    productsMessage.textContent = "عدد المنتجات: " + productsToShow.length;

    // نمر على كل منتج ونبني له بطاقة HTML
    for (let i = 0; i < productsToShow.length; i++) {
        let product = productsToShow[i];

        // نجهز النص والزر حسب كمية المخزون
        let stockText = "الكمية المتوفرة: " + product.stock;
        let buttonText = "أضيفي إلى السلة";
        let disabledText = "";

        // إذا كان المخزون صفرًا، نغيّر النص ونعطّل الزر
        if (product.stock === 0) {
            stockText = "غير متوفر حاليًا";
            buttonText = "غير متوفر";
            disabledText = "disabled";
        }

        // نضيف بطاقة المنتج إلى صفحة HTML
        productsList.innerHTML += `
            <div class="col-12 col-md-6 col-lg-3">
                <article class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>التصنيف: ${product.category}</p>
                    <p class="product-price">${product.price} دولار</p>
                    <p>${stockText}</p>
                    <div class="product-buttons">
                        <a class="btn btn-outline-secondary" href="product-details.html?id=${product.id}">تفاصيل المنتج</a>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}" ${disabledText}>${buttonText}</button>
                    </div>
                </article>
            </div>
        `;
    }
}

// 4) دالة تبحث حسب الاسم والتصنيف، ثم تعرض النتيجة
function searchProducts() {
    // نقرأ القيم من مربع البحث والقوائم
    let searchWord = searchInput.value.toLowerCase();
    let chosenCategory = categorySelect.value;
    let chosenSort = sortSelect.value;

    // نبدأ بقائمة نتائج فارغة
    let results = [];

    // نفحص كل منتج: هل اسمه وتصنيفه يطابقان الاختيار؟
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let nameMatches = product.name.toLowerCase().includes(searchWord);
        let categoryMatches = chosenCategory === "all" || product.category === chosenCategory;

        // إذا كان المنتج نشطًا ومناسبًا للبحث نضيفه للنتائج
        if (product.active !== false && nameMatches && categoryMatches) {
            results.push(product);
        }
    }

    // ترتيب السعر من الأقل إلى الأعلى
    if (chosenSort === "low") {
        results.sort(function (firstProduct, secondProduct) {
            return firstProduct.price - secondProduct.price;
        });
    }

    // ترتيب السعر من الأعلى إلى الأقل
    if (chosenSort === "high") {
        results.sort(function (firstProduct, secondProduct) {
            return secondProduct.price - firstProduct.price;
        });
    }

    // نرسل النتائج إلى دالة العرض
    showProducts(results);
}

// 5) نربط البحث والقوائم بالدالة
// عند الكتابة في البحث نشغّل البحث من جديد
searchInput.addEventListener("input", searchProducts);

// عند تغيير التصنيف أو ترتيب السعر نشغّل البحث من جديد
categorySelect.addEventListener("change", searchProducts);
sortSelect.addEventListener("change", searchProducts);

// عند الضغط على زر المسح نعيد القيم إلى وضعها الأول
clearButton.addEventListener("click", function () {
    searchInput.value = "";
    categorySelect.value = "all";
    sortSelect.value = "default";

    // نعرض المنتجات بعد مسح الاختيارات
    searchProducts();
});

// 6) نسمع الضغط على أزرار الإضافة الموجودة داخل البطاقات
productsList.addEventListener("click", function (event) {
    // نفحص هل الزر المضغوط زر إضافة للسلة
    if (event.target.classList.contains("add-to-cart")) {
        // نقرأ رقم المنتج من data-id
        let productId = Number(event.target.getAttribute("data-id"));

        // نرسل رقم المنتج إلى دالة الإضافة
        addToCart(productId);
    }
});

// 7) دالة تضيف منتجًا واحدًا إلى السلة
function addToCart(productId) {
    let chosenProduct = null;

    // نبحث عن المنتج الذي ضغطتِ على زرّه
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            chosenProduct = products[i];
        }
    }

    // نقرأ السلة؛ إذا لم تكن موجودة نبدأ بمصفوفة فارغة
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let itemInCart = null;

    // نتحقق هل المنتج موجود في السلة من قبل
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            itemInCart = cart[i];
        }
    }

    // إذا كان المنتج موجودًا، نزيد الكمية واحدًا
    if (itemInCart !== null) {
        if (itemInCart.quantity < chosenProduct.stock) {
            itemInCart.quantity = itemInCart.quantity + 1;
        } else {
            alert("لا توجد كمية إضافية متوفرة.");
            return;
        }
    } else {
        // إذا لم يكن موجودًا، ننشئ كائنًا جديدًا له
        let newItem = {
            id: chosenProduct.id,
            name: chosenProduct.name,
            price: chosenProduct.price,
            image: chosenProduct.image,
            stock: chosenProduct.stock,
            quantity: 1
        };

        // نضيف الكائن إلى مصفوفة السلة
        cart.push(newItem);
    }

    // نحفظ السلة بعد تحويلها إلى نص
    localStorage.setItem("cart", JSON.stringify(cart));

    // نخبر المستخدم أن الإضافة تمت
    alert("تمت إضافة المنتج إلى السلة.");
}

// 8) عند فتح صفحة المنتجات، نعرض القائمة أول مرة
searchProducts();
