const cartContainer = document.querySelector('.cart');
const cartList = document.querySelector('.cart-list');
const cartQuantity = document.querySelector('.cart_quantity');

export const fetchCart = async () => {
    const response = await fetch('/api/v1/cart/get');
    const data = await response.json();
    if (!response.ok && response.status === 403) {
        throw new Error('Not logged in');
    }
    return data.data;
}

const removeFromCart = async (id) => {
    const response = await fetch(`/api/v1/cart/remove/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data;
}

const renderCart = (cart ) => {
    let totalPrice = 0 ;
    let totalQuantity = 0;
    cartList.innerHTML = cart.map((item) => {
        totalPrice += item.products_in_cart.price * item.quantity;
        totalQuantity += item.quantity;
        return `
        <li>
            <a href="#" class = "image">
            <img src="${item.products_in_cart.image}" class="cart-thumb" alt="product">
            </a>
            <div class="cart-item-desc">
                <h6> <a href ="/product-details/${item.products_in_cart.id}">${item.products_in_cart.name}</a></h6>
                <p>${item.quantity}x - <span class="price">$${item.products_in_cart.price}</span></p>
            </div> 
            <span class = "dropdown-product-remove" data-id="${item.products_in_cart.id}"><i class = "icon-cross" > </i></span>
        </li>`
    }).join(' ');

    cartList.innerHTML += `<li class="total">
                          <span class="pull-right">Total: $${totalPrice}</span>
                          <a href="/cart/" class="btn btn-sm btn-cart">Cart</a>
                          <a href="/checkout/" class="btn btn-sm btn-checkout"
                            >Checkout</a
                          >
    </li>`;
    cartQuantity.innerHTML = cart.length;
    const headerCartButton = document.querySelector('#header-cart-btn');
    headerCartButton.innerHTML = `
        <span class="cart_quantity">${totalQuantity}</span>
            <i class="ti-bag"></i> Your Bag $${totalPrice}
    `
}

export const loadCart = async () => {
    cartContainer.classList.toggle('hidden');
    try{
        const cart = await fetchCart();
        renderCart(cart);
        cartContainer.classList.toggle('hidden');

    }
    catch(error) {

    }
}

export const addToCart = async (element, id , quantity = 1) => {
    const elementContent = element.innerHTML;
    element.innerHTML = '<span class="loader" role="status" aria-hidden="true"></span>';
    const body = {
        productId : id,
        quantity : quantity
    }
    const response = await fetch(`/api/v1/cart/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body),
    });
    const data = await response.json();
    if(!response.ok && response.status === 403) {
        window.location.href = '/auth/login';
        return;
    }
    else if(!response.ok) {
        window.alert(data.message);
        element.innerHTML = elementContent;
        return;
    }
    const cart = data.data;
    renderCart(cart);
    element.innerHTML = elementContent;
}

const clearCart = async () => {
    const response = await fetch('/api/v1/cart/clear', {
        method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) {
        window.alert(data.message);
        return;
    }
    renderCart([]);
}
