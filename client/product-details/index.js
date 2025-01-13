import { isLogged } from '../public/js/auth.js';
import { loadCart } from '../public/js/cart.js';
import { addToCart as addTOCartEvent } from '../public/js/cart.js';

loadCart();

const cartSubmitEvent = document.querySelector('.cart-submit-event');

cartSubmitEvent.addEventListener('click', async (event) => {
    event.preventDefault();
    const productId = getProductIdFromUrl() ; 
    const quantity = document.getElementById('qty').value;
    await addTOCartEvent(event.target, productId, quantity);
});

const wrapper = document.querySelector('#wrapper');

// document.addEventListener('DOMContentLoaded', async () => {
//     const productId = getProductIdFromUrl();
//     if (!productId) {
//         window.location.href = '/shop/';
//     } else {
//         const productData = await fetchProductDetails(productId);

//         if (productData) {
//             renderProductDetails(productData);
//         }
//     }
// });

function getProductIdFromUrl() {
    const url = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const pathSegments = window.location.pathname.split('/');
    const productId = pathSegments[pathSegments.length - 1];
    //url = 'http://localhost:3000/product-details/1'
    return productId;
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
        <li data-target="#product_details_slider" data-slide-to="1" class="${isActive}" style="background-image: url(${imgUrl}); object-fit: cover;"></li>
    `;
    carouselIndicators.insertAdjacentHTML('beforeend', indicatorItem);

    const cartForm = document.querySelector('.cart');
    cartForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const quantity = document.getElementById('qty').value;
        addToCart(product.id, quantity);
    });
}



async function getRelatedProduct(id) {
    try {
        const response = await fetch(`/api/v1/product/related/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch related products');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
    }
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
                    <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${product.name}</p>
                    <div class="d-flex justify-content-between">
                        <a href="#" class="add-to-cart-btn add-to-cart-event">ADD TO CART</a>
                        <a href="/product-details/?id=${product.id}" class="add-to-cart-btn">DETAIL</a>
                    </div>
                </div>
            </div>
        `;
        relatedProductsContainer.innerHTML += productHTML;
    });

    (function ($) {
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
                        items: 1,
                    },
                    576: {
                        items: 2,
                    },
                    768: {
                        items: 3,
                    },
                },
            });
        }
    })(jQuery);
}


const addToCartButtons = document.querySelectorAll(".add-to-cart-event");
addToCartButtons.forEach((button) => {
    button.addEventListener("click", async(event) => {
        event.preventDefault();
        console.log("clicked");
        const productId = button.getAttribute("data-id");
        await addTOCartEvent(event.target ,productId);
        await loadCart();
    });
});

const reviewList = document.querySelector('#reviewsList');
const reviewPagination = document.querySelector('#reviewsPagination');
const fetchReviews = async (productId) => {
    try {
        const response = await fetch(`/api/v1/product/review/${productId}?perPage=3`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        const reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
};

const renderReviews = (reviews) => {
    reviewList.innerHTML = '';
    reviews.forEach((review) => {
        const reviewHTML = `
            <li class="list-group-item">
                <div class="d-flex justify-content-between">
                    <h5>${review.user.name}</h5>
                    <span>${review.rating} <i class="fa fa-star
                    ${review.rating >= 1 ? 'text-warning' : ''}"></i>
                    <i class="fa fa-star
                    ${review.rating >= 2 ? 'text-warning' : ''}"></i>
                    <i class="fa fa-star
                    ${review.rating >= 3 ? 'text-warning' : ''}"></i>
                    <i class="fa fa-star
                    ${review.rating >= 4 ? 'text-warning' : ''}"></i>
                    <i class="fa fa-star
                    ${review.rating >= 5 ? 'text-warning' : ''}"></i>
                    </span>
                </div>
                <p>${review.review}</p>
            </li>
        `;
        reviewList.insertAdjacentHTML('beforeend', reviewHTML);
    }
    );
}

const renderReviewPagination = (meta) => {
    console.log("get meta", meta);
    reviewPagination.innerHTML = '';

    if (meta.currentPage > 1) {
        reviewPagination.insertAdjacentHTML('beforeend', `
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous" data-page="${meta.currentPage - 1}">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `);
    }

    for (let i = 1; i <= meta.lastPage; i++) {
        reviewPagination.insertAdjacentHTML('beforeend', `
            <li class="page-item ${i === meta.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `);
    }

    if (meta.currentPage < meta.lastPage) {
        reviewPagination.insertAdjacentHTML('beforeend', `
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next" data-page="${meta.currentPage + 1}">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `);
    }

    reviewPagination.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            const response = await fetch(`/api/v1/product/review/${getProductIdFromUrl()}?page=${page}&perPage=3`);
            const reviews = await response.json();
            renderReviews(reviews.data);
            renderReviewPagination(reviews.meta);
        });
    });
};


document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetchReviews(getProductIdFromUrl());
    const reviews =  response.data;
    await renderReviews(reviews);
    renderReviewPagination(response.meta);
});

const reviewForm = document.querySelector('#reviewForm');
reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (! await isLogged()) {
        window.location.href = '/auth/login';
        return;
    }
    const review = document.querySelector('#reviewContent').value;
    const rating = document.querySelector('#reviewRating').value;
    const productId = getProductIdFromUrl();
    const response = await fetch(`/api/v1/user/review/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review, rating }),
    });
    const result = await response.json();
    if (result.success) {
        const reviews = await fetchReviews(productId);
        renderReviews(reviews.data);
        renderReviewPagination(reviews.meta);
    }
});