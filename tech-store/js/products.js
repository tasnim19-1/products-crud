// نقرأ المنتجات المحفوظة في المتصفح
let products = JSON.parse(localStorage.getItem("products"));

// إذا لم تكن هناك منتجات محفوظة، نستخدم القائمة الموجودة في product-data.js
if (products === null) {
    products = defaultProducts;
} else {
    // نضيف أي منتج ابتدائي ناقص إلى القائمة المحفوظة
    for (let i = 0; i < defaultProducts.length; i++) {
        let found = false;

        for (let j = 0; j < products.length; j++) {
            if (products[j].id === defaultProducts[i].id) {
                found = true;
            }
        }

        if (found === false) {
            products.push(defaultProducts[i]);
        }
    }
}

let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

// نحدّث المخزون من القيمة المحفوظة
for (let i = 0; i < products.length; i++) {
    if (inventory[products[i].id] !== undefined) {
        products[i].stock = inventory[products[i].id];
    }

    if (products[i].active === undefined) {
        products[i].active = true;
    }
}

localStorage.setItem("products", JSON.stringify(products));

// نصل إلى عناصر HTML
const productsList = document.getElementById("productsList");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const productsMessage = document.getElementById("productsMessage");

// هذه الدالة تعرض المنتجات
function showProducts(list) {
    productsList.innerHTML = "";

    if (list.length === 0) {
        productsMessage.textContent = "لا توجد منتجات مطابقة.";
        return;
    }

    productsMessage.textContent = "عدد المنتجات: " + list.length;

    for (let i = 0; i < list.length; i++) {
        let product = list[i];
        let stockMessage = "الكمية المتوفرة: " + product.stock;
        let buttonText = "أضيفي إلى السلة";
        let buttonDisabled = "";

        if (product.stock === 0) {
            stockMessage = "غير متوفر حاليًا";
            buttonText = "غير متوفر";
            buttonDisabled = "disabled";
        }

        productsList.innerHTML += `
            <div class="col-12 col-md-6 col-lg-3">
                <article class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>التصنيف: ${product.category}</p>
                    <p class="product-price">${product.price} دولار</p>
                    <p>${stockMessage}</p>
                    <a class="btn btn-outline-secondary mb-2" href="product-details.html?id=${product.id}">تفاصيل المنتج</a>
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}" ${buttonDisabled}>${buttonText}</button>
                </article>
            </div>
        `;
    }
}

// هذه الدالة تبحث وتفلتر وترتب النتائج
function filterProducts() {
    let searchText = searchInput.value.toLowerCase();
    let selectedCategory = categorySelect.value;
    let selectedSort = sortSelect.value;
    let result = [];

    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let nameMatches = product.name.toLowerCase().includes(searchText);
        let categoryMatches = selectedCategory === "all" || product.category === selectedCategory;

        if (product.active !== false && nameMatches && categoryMatches) {
            result.push(product);
        }
    }

    if (selectedSort === "low") {
        result.sort(function (a, b) {
            return a.price - b.price;
        });
    }

    if (selectedSort === "high") {
        result.sort(function (a, b) {
            return b.price - a.price;
        });
    }

    showProducts(result);
}

// عند الكتابة أو تغيير الاختيار، نعيد عرض المنتجات
searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);
sortSelect.addEventListener("change", filterProducts);

// زر مسح البحث والاختيارات
document.getElementById("clearFilters").addEventListener("click", function () {
    searchInput.value = "";
    categorySelect.value = "all";
    sortSelect.value = "default";
    filterProducts();
});

// عند الضغط على زر الإضافة، نعرف رقم المنتج ونضيفه للسلة
productsList.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart")) {
        let productId = Number(event.target.getAttribute("data-id"));
        addToCart(productId);
    }
});

function addToCart(productId) {
    let product = null;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
        }
    }

    if (product === null || product.stock < 1) {
        alert("هذا المنتج غير متوفر حاليًا.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItem = null;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cartItem = cart[i];
        }
    }

    if (cartItem !== null) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity = cartItem.quantity + 1;
            cartItem.stock = product.stock;
        } else {
            alert("لا توجد كمية إضافية متوفرة.");
            return;
        }
    } else {
        let newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
            quantity: 1
        };
        cart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("تمت إضافة المنتج إلى السلة.");
}

// أول عرض للمنتجات عند فتح الصفحة
filterProducts();
