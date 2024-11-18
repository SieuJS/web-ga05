
document.addEventListener('DOMContentLoaded', async function() {
    const productId = getProductIdFromUrl();
    if(!productId) {
        window.location.href = '/shop/';
    }
    else{
    const productData = await fetchProductDetails(productId);
    
    if (productData) {
        renderProductDetails(productData);
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
    const productBaseColour = document.querySelector('.single_product_desc .color');
    const productGender = document.querySelector('.single_product_desc .gender');
    const productSizeList = document.querySelector('.single_product_desc .widget-desc ul');
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
