// هذه قائمة المنتجات الأساسية في المتجر
// كل منتج عبارة عن object يحتوي على بياناته
const defaultProducts = [
    {
        id: 1,
        name: "Samsung Galaxy",
        category: "هواتف",
        price: 500,
        description: "هاتف ذكي مناسب للاستخدام اليومي.",
        image: "images/phone.svg",
        stock: 5,
        active: true
    },
    {
        id: 2,
        name: "Lenovo Laptop",
        category: "لابتوبات",
        price: 750,
        description: "لابتوب مناسب للعمل والدراسة.",
        image: "images/laptop.svg",
        stock: 3,
        active: true
    },
    {
        id: 3,
        name: "Wireless Headphones",
        category: "سماعات",
        price: 80,
        description: "سماعات لاسلكية للاستماع إلى الموسيقى.",
        image: "images/headphones.svg",
        stock: 0,
        active: true
    },
    {
        id: 4,
        name: "Phone Charger",
        category: "إكسسوارات",
        price: 20,
        description: "شاحن هاتف عملي للاستخدام اليومي.",
        image: "images/charger.svg",
        stock: 10,
        active: true
    },
    {
        id: 101,
        name: "iPhone 15",
        category: "هواتف",
        price: 899,
        description: "هاتف ذكي بكاميرا عالية الجودة.",
        image: "images/phone.svg",
        stock: 6,
        active: true
    },
    {
        id: 102,
        name: "Google Pixel 8",
        category: "هواتف",
        price: 699,
        description: "هاتف ذكي بتصميم أنيق وأداء سريع.",
        image: "images/phone.svg",
        stock: 4,
        active: true
    },
    {
        id: 103,
        name: "Xiaomi Redmi Note",
        category: "هواتف",
        price: 299,
        description: "هاتف عملي بسعر مناسب.",
        image: "images/phone.svg",
        stock: 8,
        active: true
    },
    {
        id: 104,
        name: "Nokia G42",
        category: "هواتف",
        price: 249,
        description: "هاتف للاستخدام اليومي مع بطارية جيدة.",
        image: "images/phone.svg",
        stock: 5,
        active: true
    },
    {
        id: 105,
        name: "Dell Inspiron",
        category: "لابتوبات",
        price: 820,
        description: "لابتوب مناسب للدراسة والعمل المكتبي.",
        image: "images/laptop.svg",
        stock: 4,
        active: true
    },
    {
        id: 106,
        name: "HP Pavilion",
        category: "لابتوبات",
        price: 910,
        description: "لابتوب للاستخدام المنزلي والدراسة.",
        image: "images/laptop.svg",
        stock: 3,
        active: true
    },
    {
        id: 107,
        name: "Asus VivoBook",
        category: "لابتوبات",
        price: 780,
        description: "لابتوب خفيف للتنقل والعمل.",
        image: "images/laptop.svg",
        stock: 6,
        active: true
    },
    {
        id: 108,
        name: "Acer Aspire",
        category: "لابتوبات",
        price: 650,
        description: "لابتوب بمواصفات مناسبة للمهام اليومية.",
        image: "images/laptop.svg",
        stock: 2,
        active: true
    },
    {
        id: 109,
        name: "Sony Headphones",
        category: "سماعات",
        price: 120,
        description: "سماعات مريحة للاستماع اليومي.",
        image: "images/headphones.svg",
        stock: 7,
        active: true
    },
    {
        id: 110,
        name: "JBL Tune",
        category: "سماعات",
        price: 65,
        description: "سماعات خفيفة بصوت واضح.",
        image: "images/headphones.svg",
        stock: 9,
        active: true
    },
    {
        id: 111,
        name: "Gaming Headset",
        category: "سماعات",
        price: 95,
        description: "سماعة رأس مناسبة للألعاب والمكالمات.",
        image: "images/headphones.svg",
        stock: 4,
        active: true
    },
    {
        id: 112,
        name: "USB-C Cable",
        category: "إكسسوارات",
        price: 12,
        description: "كابل USB-C للشحن ونقل البيانات.",
        image: "images/charger.svg",
        stock: 20,
        active: true
    },
    {
        id: 113,
        name: "Phone Case",
        category: "إكسسوارات",
        price: 18,
        description: "غطاء حماية للهاتف.",
        image: "images/charger.svg",
        stock: 15,
        active: true
    },
    {
        id: 114,
        name: "Wireless Mouse",
        category: "إكسسوارات",
        price: 25,
        description: "فأرة لاسلكية للاستخدام مع الحاسوب.",
        image: "images/charger.svg",
        stock: 11,
        active: true
    },
    {
        id: 115,
        name: "Keyboard",
        category: "إكسسوارات",
        price: 35,
        description: "لوحة مفاتيح عملية للحاسوب.",
        image: "images/charger.svg",
        stock: 8,
        active: true
    },
    {
        id: 116,
        name: "Power Bank",
        category: "إكسسوارات",
        price: 40,
        description: "بطارية متنقلة لشحن الأجهزة أثناء التنقل.",
        image: "images/charger.svg",
        stock: 10,
        active: true
    }
];
