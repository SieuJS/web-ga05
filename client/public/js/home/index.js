import { addToCart , loadCart } from "../cart.js";
loadCart();

// document.addEventListener("DOMContentLoaded", async () => {

//         const addToCartButtons = document.querySelectorAll(".add-to-cart-event");
//         addToCartButtons.forEach((button) => {
//             button.addEventListener("click", (event) => {
//                 event.preventDefault();
//                 const productId = button.getAttribute("data-id");
//                 addToCart(event.target ,productId);
//             });
//         });
// });
        const addToCartButtons = document.querySelectorAll(".add-to-cart-event");
        addToCartButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const productId = button.getAttribute("data-id");
                addToCart(event.target ,productId);
            });
        });
const fetchNewArrivals = async () => {
    try {
        const response = await fetch("/api/v1/product/new-arrivals");
        if (!response.ok) {
            throw new Error("Failed to fetch new arrivals");
        }

        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Error loading new arrivals:", error);
    }
};

const renderNewArrivals = (products) => {
    const newArrivalsContainer = document.querySelector(".karl-new-arrivals");
    newArrivalsContainer.innerHTML = "";
    products.forEach((product) => {
        const productHTML = `
            <div class = "col-12 col-sm-6 col-lg-4 single_gallery_item ${product.gender?.toLowerCase()} ${product.usage?.toLowerCase()} wow fadeInUpBig" data-wow-delay="0.2s">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" />
                    <div class="product-quicview">
                        <a href="#" data-toggle="modal" data-target="#quickview"><i class="ti-plus"></i></a>
                    </div>
                </div>
                <div class="product-description">
                    <h4 class="product-price">₹${parseFloat(
                        product.price
                    ).toFixed(2)}</h4>
                    <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis ellipsis;">${product.name}</p>
                    <div class="d-flex justify-content-between">
                        <a href="#"
                        data-id="${product.id}"
                        class="add-to-cart-btn add-to-cart-event">ADD TO CART</a>
                        <a href="/product-details/?id=${
                            product.id
                        }" class="add-to-cart-btn ">DETAIL</a>
                    </div>
                </div>
            </div>
        `;
        newArrivalsContainer.innerHTML += productHTML;
    });
};
