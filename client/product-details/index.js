const wrapper = document.querySelector('#wrapper');

document.addEventListener('DOMContentLoaded', async function() {
    const productId = getProductIdFromUrl();
    if(!productId) {
        window.location.href = '/shop/';
    }
    else{
    const productData = await fetchProductDetails(productId);
    
    if (productData) {
        renderProductDetails(productData);
        let relatedProducts = await getRelatedProduct(productId);
        renderRelatedProducts(relatedProducts);
    }
    }
});

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`/api/v1/product/detail/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

function renderProductDetails(product) {
    const productTitle = document.querySelector('.single_product_desc .title a');
    const productPrice = document.querySelector('.single_product_desc .price');
    const productDescription = document.querySelector('.single_product_desc .card-body');
    const productImages = document.querySelector('#product_details_slider .carousel-inner');
    const carouselIndicators = document.querySelector('#product_details_slider .carousel-indicators');
    
    productTitle.textContent = product.name;
    productPrice.textContent = `₹${parseFloat(product.price).toFixed(2)}`;
    productDescription.innerHTML = `<p>${product.description}</p>`;

    productImages.innerHTML = '';
    carouselIndicators.innerHTML = '';
    const imgUrl = product.image;
    const isActive = 'active';
    const carouselItem = `
        <div class="carousel-item ${isActive}">
            <a class="gallery_img" href="${imgUrl}">
                <img class="d-block w-100" src="${imgUrl}" alt="Product Image ${product.id}" style="object-fit: contain; height: 500px;">
            </a>
        </div>
    `;
    productImages.insertAdjacentHTML('beforeend', carouselItem);
    const indicatorItem = `
            <li data-target="#product_details_slider" data-slide-to="${1}" class="${isActive}" style="background-image: url(${imgUrl}); object-fit: cover;"></li>
        `;
    carouselIndicators.insertAdjacentHTML('beforeend', indicatorItem);

    const cartForm = document.querySelector('.cart');
    cartForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const quantity = document.getElementById('qty').value;
        addToCart(product.id, quantity);
    });
}

function addToCart(productId, quantity) {
    console.log(`Added ${quantity} of Product ID ${productId} to the cart`);
}


async function getRelatedProduct (id) {
    const response = await fetch('/api/v1/product/related/'+id);
    if (!response.ok) {
        throw new Error('Failed to fetch related products');
    }
    const products = await response.json();
    return products;
}

function renderRelatedProducts(products) {
    const relatedProductsContainer = document.querySelector('.you_make_like_slider.owl-carousel');
    relatedProductsContainer.innerHTML = '';
    products.forEach((product) => {
        const productHTML = `
            <div class="single_gallery_item" style="overflow: hidden;"> 
            <div class="product-img">
            <img src="${product.image}" alt="${product.name}" style="object-fit: contain; height: 200px;" />
            <div class="product-quicview">
            <a href="#" data-toggle="modal" data-target="#quickview"><i class="ti-plus"></i></a>
            </div>
            </div>
            <div class="product-description" style="overflow: hidden;">
            <h4 class="product-price">₹${parseFloat(product.price).toFixed(2)}</h4>
            <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis ellipsis;">${product.name}</p>
            <div class="d-flex justify-content-between">
            <a href="#" class="add-to-cart-btn">ADD TO CART</a>
            <a href="/product-details/?id=${product.id}" class="add-to-cart-btn">DETAIL</a>
            </div>
            </div>
            </div>
        `;
        relatedProductsContainer.innerHTML += productHTML;
    });
    (function($) {
        'use strict';
        if ($.fn.owlCarousel) {
            $('.you_make_like_slider').owlCarousel({
                items: 3,
                margin: 30,
                loop: true,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 7000,
                smartSpeed: 1000,
                responsive: {
                    0: {
                        items: 1
                    },
                    576: {
                        items: 2
                    },
                    768: {
                        items: 3
                    }
                }
            });
        }
    })(jQuery);
}

