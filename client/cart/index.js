import { fetchCart } from "../public/js/cart.js";

const cartTableBody = document.querySelector('.cart-table-body');
let totalPrice = 0;

import {isLogged} from "../public/js/auth.js";

const toUpdateProducts = [

];


const loadCartDetail = async () => {
    if(! await isLogged()) {
        window.location.href = '/auth/login';
    }
    cartTableBody.innerHTML = '<tr><td colspan="4"><span class = "loader"></span></td></tr>';
    try {
        const cart = await fetchCart();
        renderCartDetail(cart);
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}


const renderCartDetail = (cart) => {
    let totalQuantity = 0;
    cartTableBody.innerHTML = cart.map((item) => {
        totalPrice += item.products_in_cart.price * item.quantity;
        totalQuantity += item.quantity;
        return `
        <tr>
            <td class="cart_product_img d-flex align-items-center">
                <a href="#"><img src="${item.products_in_cart.image}" alt="Product"></a>
                <h6>${item.products_in_cart.name}</h6>
            </td>
            <td class="price"><span id = "price-${item.products_in_cart.id}">$${item.products_in_cart.price}</span></td>
            <td class="qty">
                <div class="quantity" data-id = ${item.products_in_cart.id}>
                    <span class="qty-minus"
                        onclick="var effect = document.getElementById('qty-${item.products_in_cart.id}'); var qty = effect.value; if( !isNaN( qty ) && qty > 0 ) effect.value--;return false;"><i
                            class="fa fa-minus" aria-hidden="true"></i></span>
                    <input type="number" class="qty-text" id="qty-${item.products_in_cart.id}" step="1" min="1" max="${item.products_in_cart.quantity}" name="quantity" value="${item.quantity}">
                    <span class="qty-plus"
                        onclick="var effect = document.getElementById('qty-${item.products_in_cart.id}'); var qty = effect.value; if( !isNaN( qty ) && qty < ${item.products_in_cart.quantity}) effect.value++;return false;"><i
                        class="fa fa-plus" aria-hidden="true"></i></span>
                </div>
                <div class = "insock">In Stock: ${item.products_in_cart.quantity}</div>
            </td>
            <td class="total_price"><span id = "total-price-${item.products_in_cart.id}">$${item.products_in_cart.price * item.quantity}</span>
            </td>
        </tr>
        `;
    }).join(' ');
    updateTotalPrice();
    const quantityInputs = document.querySelectorAll('.quantity');

    quantityInputs.forEach((quantityEle) => {
        quantityEle.addEventListener('click', async (event) => {

            const productId = quantityEle.getAttribute('data-id');
            const input = document.getElementById(`qty-${productId}`);

            const quantity = input.value;
            const totalPriceElement = document.getElementById(`total-price-${productId}`);
            totalPrice -= parseFloat(totalPriceElement.innerHTML.slice(1));
            const priceElement = document.getElementById(`price-${productId}`);

            const price = parseFloat(priceElement.innerHTML.slice(1));
            totalPriceElement.innerText = `$${price * quantity}`;
            totalPrice += price * quantity;
            
            const toUpdateProductIndex = toUpdateProducts.findIndex((product) => product.productId === productId);
            if(toUpdateProductIndex === -1) {
                toUpdateProducts.push({
                    productId,
                    quantity
                });
            }
            else {
                toUpdateProducts[toUpdateProductIndex].quantity = quantity;
            }

            console.log(toUpdateProducts);
            updateTotalPrice();
        });
    });
}
const updateTotalPrice = () => {
    document.getElementById('total-price-cart').innerText = `$${totalPrice}`;
    let shipFee = document.getElementById('ship-fee').innerText;
    if(isNaN(shipFee)){
        shipFee = 0;
    }
    document.getElementById('total-price-all').innerText = `$${totalPrice + parseFloat(shipFee)}`;
}
loadCartDetail();


const buttonClearCart = document.querySelector('.btn-clear-cart');
buttonClearCart.addEventListener('click', async () => {
    buttonClearCart.innerHTML = '<span class="loader"></span>';
    const response = await fetch('/api/v1/cart/clear', {
        method: 'DELETE'
    });
    if(response.ok) {
        cartTableBody.innerHTML = '<tr><td colspan="4"><h3>Your cart is empty</hjson></td></tr>';
    }
    else {
        console.error('Failed to clear cart');
    }
    buttonClearCart.innerHTML = 'CLEAR CART';
});

const buttonUpdateCart = document.querySelector('.btn-update-cart');
buttonUpdateCart.addEventListener('click', async () => {
    buttonUpdateCart.innerHTML = '<span class="loader"></span>';
    const response = await fetch('/api/v1/cart/update', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            [...toUpdateProducts]
        )
    });
    if(response.ok) {
        loadCartDetail();
    }
    else {
        console.error('Failed to update cart');
        window.alert('Failed to update cart');
    }
    buttonUpdateCart.innerHTML = 'UPDATE CART';
    window.location.reload();
});