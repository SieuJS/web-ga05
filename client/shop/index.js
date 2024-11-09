// Function to load and display products
async function loadProducts() {
    try {
      // Fetch product data from the API
      const response = await fetch('/api/v1/product');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
  
      const products = (await response.json()).data;

  
      // Get the container where products will be displayed
      const productContainer = document.getElementById('product-list');
      // Clear any existing content in the container
    productContainer.innerHTML = '';
      // Loop through each product and create HTML structure
      products.forEach((product) => {
        // Create product HTML structure using template literal
        const productHTML = `
          <div class="col-12 col-sm-6 col-lg-4 single_gallery_item wow fadeInUpBig" data-wow-delay="0.9s">
            <!-- Product Image -->
            <div class="product-img">
              <img src="${product.image}" alt="${product.productName}" />
              <div class="product-quicview">
                <a href="#" data-toggle="modal" data-target="#quickview"><i class="ti-plus"></i></a>
              </div>
            </div>
            <!-- Product Description -->
            <div class="product-description">
              <h4 class="product-price">$${(product.price / 100).toFixed(2)}</h4>
              <p>${product.productName}</p>
              <!-- Add to Cart and Detail Links -->
              <div class="d-flex justify-content-between">
                <a href="#" class="add-to-cart-btn">ADD TO CART</a>
                <a href="/product-details/?id=${product.id}" class="add-to-cart-btn">DETAIL</a>
              </div>
            </div>
          </div>
        `;
  
        // Insert the product HTML into the container
        productContainer.innerHTML += productHTML;
      });
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }
  
  // Call loadProducts function when the page loads
  document.addEventListener('DOMContentLoaded', loadProducts);
  