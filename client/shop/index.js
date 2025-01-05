import { addToCart, loadCart } from "../public/js/cart.js";
import {
    clearColorQuery,
    clearSeasonQuery,
    getSeasonQuery,
    loadProductQuery,
    setSearchQuery,
    setSeasonQuery,
    getSearchQuery,
    setLinkAndAjax,
    setPageQuery,
    clearPageQuery,
} from "../public/js/product-query.js";
import { paginateRender } from "../public/js/paginate.js";

document.addEventListener("DOMContentLoaded", async () => {
    const addToCartButtons =
    document.querySelectorAll(".add-to-cart-event");
    addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = button.getAttribute("data-id");
        addToCart(event.target, productId);
    });
});
});

loadCart();
export async function loadProducts() {
    try {
        const productContainer = document.getElementById("product-list");
        productContainer.innerHTML = '<span class="loader"></span>';
        const payload = await loadProductQuery();
        const products = payload.data;
        const meta = payload.meta;
        productContainer.innerHTML = "";
        productContainer.innerHTML = "";
        products.forEach((product) => {
            const productHTML = `
<div class="col-12 col-sm-6 col-lg-4 single_gallery_item wow fadeInUpBig" data-wow-delay="0.2s">
  <div class="product-img">
    <img src="${product.image}" alt="${product.name}" />
    <div class="product-quicview">
      <a href="#" data-toggle="modal" data-target="#quickview"><i class="ti-plus"></i></a>
    </div>
  </div>
  <div class="product-description">
    <h4 class="product-price">$${parseFloat(product.price).toFixed(2)}</h4>
    <p>${product.name}</p>
    <div class="d-flex justify-content-between">
      <a href="#" data-id="${
          product.id
      }" class="add-to-cart-btn add-to-cart-event">ADD TO CART</a>
      <a href="/product-details/?id=${
          product.id
      }" class="add-to-cart-btn">DETAIL</a>
    </div>
  </div>
</div>
`;
            productContainer.innerHTML += productHTML;
        });

        const addToCartButtons =
            document.querySelectorAll(".add-to-cart-event");
        addToCartButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const productId = button.getAttribute("data-id");
                addToCart(event.target, productId);
            });
        });
        paginateRender(meta);
        const paginateContainer = document.querySelector(
            ".shop_pagination_area"
        );
        paginateContainer.querySelectorAll(".page-link").forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const page = e.target.getAttribute("data-page");
                if (page && page !== "...") {
                    // Perform AJAX request to fetch new page data
                    console.log("Loading page", page);
                    setPageQuery(page);
                    setLinkAndAjax();
                    loadProducts();
                }
            });
        });
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// document.addEventListener('DOMContentLoaded', loadProducts);

const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchQuery = document.getElementById("search-input").value;
    setSearchQuery(searchQuery);
    clearPageQuery();
    setLinkAndAjax();
    loadProducts();
});

const searchInput = document.getElementById("search-input");
searchInput.value = getSearchQuery();

const seasonSelect = document.querySelectorAll(".season-select");
seasonSelect.forEach((season) => {
    season.addEventListener("click", (e) => {
        let seasonValue = season.querySelector("input");
        setSeasonQuery(seasonValue.value);
        clearPageQuery();
        setLinkAndAjax();
        loadProducts();
    });
});

const seasonSelectors = document.querySelectorAll(".season-select");

seasonSelectors.forEach((season) => {
    let seasonValue = season.querySelector("input");
    seasonValue = seasonValue.value;
    if (seasonValue === getSeasonQuery()) {
        season.classList.add("active");
    }
});

const seasonClear = document.getElementById("clear-season");
seasonClear.addEventListener("click", () => {
    clearSeasonQuery();
    clearPageQuery();
    setLinkAndAjax();
    loadProducts();
});

const colorClear = document.getElementById("clear-color");
colorClear.onclick = () => {
    clearColorQuery();
    clearPageQuery();
    setLinkAndAjax();
    loadProducts();
};

const categorySubmit = document.getElementById("category-submit");
categorySubmit.addEventListener("click", () => {
  clearPageQuery();
    setLinkAndAjax();
    loadProducts();
});


const paginateContainer = document.querySelector(
  ".shop_pagination_area"
);
paginateContainer.querySelectorAll(".page-link").forEach((link) => {
  link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = e.target.getAttribute("data-page");
      if (page && page !== "...") {
          // Perform AJAX request to fetch new page data
          console.log("Loading page", page);
          setPageQuery(page);
          setLinkAndAjax();
          loadProducts();
      }
  });
});