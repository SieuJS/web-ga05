import { isLogged } from "../public/js/auth.js";
import { fetchCart, loadCart } from "../public/js/cart.js";
const  orderList = document.querySelector('.order-details-form');
loadCart();
const productList = []
let totalPrice = 0;

const loadOrders = async () => {
    if(! await isLogged()) {
        window.location.href = '/auth/login';
    }
    orderList.innerHTML = '<span class = "loader"></span>';
    console.log('loading orders');
    const cart = await fetchCart();
    orderList.innerHTML = `<li><span>Product</span> <span>Total</span></li>`

    orderList.innerHTML += cart.map((item) => {
        totalPrice += item.products_in_cart.price * item.quantity;
        const product = {
            productId : item.products_in_cart.id,
            quantity : item.quantity,
            productName : item.products_in_cart.name,
            price : item.products_in_cart.price,
            totalPrice : item.products_in_cart.price * item.quantity
        }
        productList.push(product);
        return `
            <li>
                <span>${item.products_in_cart.name} </span> 
                <span>$${item.products_in_cart.price * item.quantity}</span>
            </li>`
        }).join(' ');
        orderList.innerHTML += `<li>
            <span>Total</span>
            <span>$${totalPrice}</span>
        </li>`;
}


const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click', async () => {
    submitBtn.innerHTML = '<span class="loader" role="status" aria-hidden="true"></span >';
    const addressInfor = {} ;
    addressInfor.firstName = document.getElementById('first_name').value;
    addressInfor.lastName = document.getElementById('last_name').value;
    addressInfor.company = document.getElementById('company').value;
    addressInfor.country = document.getElementById('country').value;
    addressInfor.address = document.getElementById('street_address').value;
    addressInfor.postCode = document.getElementById('postcode').value;
    addressInfor.city = document.getElementById('city').value;
    addressInfor.phone = document.getElementById('phone_number').value;
    addressInfor.email = document.getElementById('email_address').value;
    addressInfor.province = document.getElementById('state').value;

    const body = {
        addressInfor ,
        productList,
        totalPrice 
    }

    const response = await fetch('/api/v1/order/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    submitBtn.innerHTML = 'Place Order';
    if(response.ok) {
        alert('Order success');
        window.location.href = '/order';
    }
    else {
        alert('Order failed');
    }
});

loadOrders();