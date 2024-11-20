
import { clearColorQuery, clearSeasonQuery, getSeasonQuery, loadProductQuery, setLinkAndReload, setSearchQuery,setSeasonQuery, getSearchQuery } from '../public/js/product-query.js';
import { setPrice } from '../public/js/product-query.js';

async function loadProducts() {
  try {
    const products = await loadProductQuery();
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';
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
              <a href="#" class="add-to-cart-btn">ADD TO CART</a>
              <a href="/product-details/?id=${product.id}" class="add-to-cart-btn">DETAIL</a>
            </div>
          </div>
        </div>
      `;
      productContainer.innerHTML += productHTML;
    });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);

const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchQuery = document.getElementById('search-input').value;
  setSearchQuery(searchQuery);
  setLinkAndReload();
});

const searchInput = document.getElementById('search-input');
searchInput.value = getSearchQuery();



const seasonSelect = document.querySelectorAll('.season-select');
seasonSelect.forEach((season) => {
  season.addEventListener('click', (e) => {
    let seasonValue = season.querySelector('input');
    setSeasonQuery(seasonValue.value);
    setLinkAndReload();
  })
})

const seasonSelectors = document.querySelectorAll('.season-select') ; 

seasonSelectors.forEach(season => {
  let seasonValue = season.querySelector('input')
  seasonValue = seasonValue.value;
  if (seasonValue === getSeasonQuery()) {
    season.classList.add('active');
  }
})

const seasonClear = document.getElementById('clear-season');
seasonClear.addEventListener('click', () => {
  clearSeasonQuery();
  setLinkAndReload();
})

const colorClear = document.getElementById('clear-color');
colorClear.onclick = () => {
  clearColorQuery();
  setLinkAndReload();
}

const categorySubmit = document.getElementById('category-submit');
categorySubmit.addEventListener('click', () => {
  setLinkAndReload();
})

