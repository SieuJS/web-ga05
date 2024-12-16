import { ProductData } from "../../product"

export function relatedProductsRender(products : ProductData[]) {
    console.log('get in relatedProductsRender')
    return products.map((product) => {
        
        return `            
        <div class="single_gallery_item" style="overflow: hidden;">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" style="object-fit: contain; height: 200px;" />
                    <div class="product-quicview">
                        <a href="#" data-toggle="modal" data-target="#quickview"><i class="ti-plus"></i></a>
                    </div>
                </div>
                <div class="product-description" style="overflow: hidden;">
                    <h4 class="product-price">₹${parseFloat(product.price as any).toFixed(2)}</h4>
                    <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${product.name}</p>
                    <div class="d-flex justify-content-between">
                        <a href="#" class="add-to-cart-btn add-to-cart-event">ADD TO CART</a>
                        <a href="/product-details/${product.id}" class="add-to-cart-btn">DETAIL</a>
                    </div>
                </div>
        </div>`}).join('')
    }