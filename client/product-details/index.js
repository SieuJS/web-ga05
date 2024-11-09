document.addEventListener('DOMContentLoaded', async function() {
    // Fetch the product details from the API
    const productId = getProductIdFromUrl();  // Assuming the product ID is part of the URL, e.g., /product-details?id=123
    const productData = await fetchProductDetails(productId);
    
    if (productData) {
        renderProductDetails(productData);
    }
});

// Helper function to extract product ID from the URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');  // Assuming the URL looks like /product-details?id=123
}

// Fetch product details from the API
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`/api/v1/product/detail?id=${productId}`);
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

// Render the product details into the HTML
function renderProductDetails(product) {
    // Get references to the HTML elements where data will be inserted
    const productTitle = document.querySelector('.single_product_desc .title a');
    const productPrice = document.querySelector('.single_product_desc .price');
    const productDescription = document.querySelector('.single_product_desc .card-body');
    const productImages = document.querySelector('#product_details_slider .carousel-inner');
    const productColor = document.querySelector('.single_product_desc .color');
    const productBrand = document.querySelector('.single_product_desc .brand');
    const productGender = document.querySelector('.single_product_desc .gender');
    const productSizeList = document.querySelector('.single_product_desc .widget-desc ul');
    const carouselIndicators = document.querySelector('#product_details_slider .carousel-indicators');
    
    // Insert the product title, price, and description
    productTitle.textContent = product.productName;
    productPrice.textContent = `₹${(product.price / 100).toFixed(2)}`;  // Assuming price is in cents
    productDescription.innerHTML = `<p>${product.description}</p>`;
    
    // Render the primary color, brand, and gender


    // Render images in the carousel
    productImages.innerHTML = '';
    carouselIndicators.innerHTML = ''; // Clear the existing images
    const imgUrl = product.image;  // The primary image in base64 format
    const isActive = 1 // First image is active
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

    // If there are more images, handle them (you could extract them from an array or pattern)
    if (product.numImages > 1) {
        // Assuming other images are provided in a similar pattern or list
        const additionalImagesElement = document.createElement('div');
        additionalImagesElement.classList.add('additional-images');

        // Sample additional images (you can modify this part if more images are available)
        const additionalImages = [imgUrl, "url_of_other_image_1", "url_of_other_image_2"]; // Replace with actual image URLs
        additionalImages.forEach((url, index) => {
            const carouselItem = `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <a class="gallery_img" href="${url}">
                        <img class="d-block w-100" src="${url}" alt="Additional Product Image ${index + 1}">
                    </a>
                </div>
            `;
            additionalImagesElement.insertAdjacentHTML('beforeend', carouselItem);
        });

        productImages.appendChild(additionalImagesElement);
    }

    // Render available sizes (if applicable, modify accordingly)
    if (product.sizes && product.sizes.length > 0) {
        productSizeList.innerHTML = '';
        product.sizes.forEach(size => {
            const sizeItem = `<li><a href="#">${size}</a></li>`;
            productSizeList.insertAdjacentHTML('beforeend', sizeItem);
        });
    }

    // Add the "Add to Cart" form functionality
    const cartForm = document.querySelector('.cart');
    cartForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent form submission
        const quantity = document.getElementById('qty').value;
        addToCart(product.id, quantity);
    });
}

// Simulate adding to the cart (you can replace this with real cart logic)
function addToCart(productId, quantity) {
    console.log(`Added ${quantity} of Product ID ${productId} to the cart`);
    // Here, you can implement actual cart logic, like saving to localStorage or sending to a backend.
}
