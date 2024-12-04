const cartContainer = document.querySelector('.cart');
const cartList = document.querySelector('.cart-list');
const cartQuantity = document.querySelector('.cart_quantity');

const fetchCart = async () => {
    const response = await fetch('/api/v1/cart');
    const data = await response.json();
    return data;
}

const renderCart = (cart ) => {
    cartContainer.innerHTML = cart.map((item) => {
        return `
        <li>
            <a href="#" class = "image"><img src="${item.image}" alt="product"></a>
            <div class="cart-item-desc">
                <h6> <a href ="/product-details/${item.id}">${item.name}</a></h6>
                <p>1x - <span class="price">$${item.price}</span></p>
            </div> 
            <span class = "dropdown-product-remove" data-id="${item.id}"><i class = "icon-cross" > </id></span>
        </li>`
    }).join('');
}