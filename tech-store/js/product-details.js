// نقرأ قائمة المنتجات من localStorage
let products = JSON.parse(localStorage.getItem("products"));
if (products === null) {
    products = defaultProducts;
}

// نقرأ المخزون المحفوظ
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

// نحدّث المخزون والحالة لكل منتج
for (let i = 0; i < products.length; i++) {
    if (inventory[products[i].id] !== undefined) {
        products[i].stock = inventory[products[i].id];
    }
    if (products[i].active === undefined) {
        products[i].active = true;
    }
}

// نأخذ رقم المنتج من نهاية الرابط بعد علامة id=
let pageAddress = window.location.search;
let productId = Number(pageAddress.split("id=")[1]);
let product = null;

for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
        product = products[i];
    }
}

let detailsMessage = document.getElementById("detailsMessage");
let productDetails = document.getElementById("productDetails");
let quantityInput = document.getElementById("productQuantity");
let quantityError = document.getElementById("quantityError");
let addButton = document.getElementById("detailAddButton");

if (product === null || product.active === false) {
    detailsMessage.textContent = "لم نعثر على المنتج أو أنه غير متاح.";
    productDetails.hidden = true;
} else {
    productDetails.hidden = false;
    document.getElementById("detailImage").src = product.image;
    document.getElementById("detailImage").alt = product.name;
    document.getElementById("detailCategory").textContent = "التصنيف: " + product.category;
    document.getElementById("detailName").textContent = product.name;
    document.getElementById("detailDescription").textContent = product.description;
    document.getElementById("detailPrice").textContent = product.price;
    document.getElementById("detailStock").textContent = "الكمية المتوفرة: " + product.stock;
    quantityInput.max = product.stock;

    if (product.stock === 0) {
        detailsMessage.textContent = "هذا المنتج غير متوفر حاليًا.";
        addButton.disabled = true;
    }
}

// عند الضغط على الزر نتحقق من الكمية ثم نضيف المنتج للسلة
addButton.addEventListener("click", function () {
    let quantity = Number(quantityInput.value);
    quantityError.textContent = "";

    if (quantity < 1 || quantity % 1 !== 0) {
        quantityError.textContent = "اكتبي كمية صحيحة تبدأ من 1.";
        return;
    }

    if (quantity > product.stock) {
        quantityError.textContent = "الكمية المطلوبة أكبر من المخزون.";
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItem = null;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === product.id) {
            cartItem = cart[i];
        }
    }

    if (cartItem !== null) {
        if (cartItem.quantity + quantity > product.stock) {
            quantityError.textContent = "الكمية مع الموجود في السلة تتجاوز المخزون.";
            return;
        }
        cartItem.quantity = cartItem.quantity + quantity;
        cartItem.stock = product.stock;
    } else {
        let newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
            quantity: quantity
        };
        cart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    detailsMessage.textContent = "تمت إضافة المنتج إلى السلة.";
});
