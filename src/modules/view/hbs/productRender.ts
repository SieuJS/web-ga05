import { ProductData } from "../../product";

export function productRender (products : ProductData[]) {
    return products.map((product) => {
        return `
<div class = "col-12 col-sm-6 col-lg-4 single_gallery_item ${product.gender?.toLowerCase()} ${product.usage?.toLowerCase()} wow fadeInUpBig" data-wow-delay="0.2s">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" />
                    <div class="product-quicview">
                        <a href="#" data-toggle="modal" data-target="#quickview"><i class="ti-plus"></i></a>
                    </div>
                </div>
                <div class="product-description">
                    <h4 class="product-price">₹${parseFloat(
                        product.price as any
                    ).toFixed(2)}</h4>
                    <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis ellipsis;">${product.name}</p>
                    <div class="d-flex justify-content-between">
                        <a href="#"
                        data-id="${product.id}"
                        class="add-to-cart-btn add-to-cart-event">ADD TO CART</a>
                        <a href="/product-details/${
                            product.id
                        }" class="add-to-cart-btn ">DETAIL</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}