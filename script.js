const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category");
const loadMoreButton = document.getElementById("loadMore");

let products = [];
let currentCategory = "all";
let visibleProducts = 4;

let favorites = JSON.parse(
    localStorage.getItem("jmalvillainFavorites")
) || [];


// =========================
// LOAD PRODUCTS
// =========================

async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("products.json tidak ditemukan");
        }

        products = await response.json();

        displayProducts();

    } catch (error) {

        console.error(error);

        productList.innerHTML = `
            <p>Produk gagal dimuat.</p>
        `;
    }
}


// =========================
// DISPLAY PRODUCTS
// =========================

function displayProducts() {

    const searchText =
        searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product => {

        const searchMatch =
            product.name
                .toLowerCase()
                .includes(searchText);

        const categoryMatch =
            currentCategory === "all" ||
            product.category === currentCategory;

        return searchMatch && categoryMatch;
    });


    const visible =
        filteredProducts.slice(0, visibleProducts);


    productList.innerHTML = "";


    visible.forEach(product => {

        const isFavorite =
            favorites.includes(product.id);


        const card =
            document.createElement("article");

        card.className = "product-card";


        card.innerHTML = `

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
            >


            <button
                class="favorite-button"
                data-id="${product.id}"
                aria-label="Favorite"
            >
                ${isFavorite ? "♥" : "♡"}
            </button>


            <div class="product-info">

                <div class="product-name">
                    ${product.name}
                </div>


                <div class="product-price">
                    Rp ${product.price.toLocaleString("id-ID")}
                </div>


                <a
                    class="view-product"
                    href="${product.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    VIEW PRODUCT
                </a>

            </div>
        `;


        productList.appendChild(card);
    });


    // =========================
    // FAVORITE BUTTON
    // =========================

    document
        .querySelectorAll(".favorite-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id =
                    Number(button.dataset.id);

                toggleFavorite(id);
            });

        });


    // =========================
    // LOAD MORE
    // =========================

    if (visible.length >= filteredProducts.length) {

        loadMoreButton.style.display = "none";

    } else {

        loadMoreButton.style.display = "block";
    }
}


// =========================
// TOGGLE FAVORITE
// =========================

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                favoriteId => favoriteId !== id
            );

    } else {

        favorites.push(id);
    }


    localStorage.setItem(
        "jmalvillainFavorites",
        JSON.stringify(favorites)
    );


    displayProducts();
}


// =========================
// SEARCH
// =========================

searchInput.addEventListener("input", () => {

    visibleProducts = 4;

    displayProducts();

});


// =========================
// CATEGORY
// =========================

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentCategory =
            button.dataset.category;


        visibleProducts = 4;


        displayProducts();

    });

});


// =========================
// LOAD MORE
// =========================

loadMoreButton.addEventListener("click", () => {

    visibleProducts += 4;

    displayProducts();

});


// =========================
// START
// =========================

loadProducts();