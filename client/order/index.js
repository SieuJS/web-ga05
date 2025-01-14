import { isLogged } from "../public/js/auth.js";
import { loadCart } from "../public/js/cart.js";
const orderTable = document.querySelector('.order-table');
loadCart();



const loadOrders = async () => {
    if(! await isLogged()) {
        window.location.href = '/auth/login';
    }
    try {
        orderTable.innerHTML = '<span class = "loader"></span>';
        const orders = await fetchOrders();
        renderOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
    }
};

const fetchOrders = async () => {
    try {
        const response = await fetch('/api/v1/order/get');
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();
        return orders.data;
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

const renderOrders = (orders) => {
    orderTable.innerHTML = orders.map((order) => {
        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.totalPrice}</td>
                <td>${ (new Date(order.orderDate)).toLocaleDateString()}</td>
                <td>${order.status}</td>
                <td>${order.paymentStatus} ${order.paymentStatus !=='SUCCESS' ? `<button class ="btn primary-btn payment-btn" data-id = ${order.id}>Go Pay </button>` :''}</td>
                <td> <button class ="btn primary-btn detail-btn" data-id = ${order.id}>Details </button></td>
            </tr>
        `;
    }).join(' ');

    orderTable.querySelectorAll('.detail-btn').forEach((button) => {
        button.addEventListener('click', async () => {
            console.log('clicked');
            const orderId = button.getAttribute('data-id');
            renderOrderDetails(orderId);
        });
    });

    orderTable.querySelectorAll('.payment-btn').forEach((button) => {
        button.addEventListener('click', async () => {
            console.log('clicked');
            const orderId = button.getAttribute('data-id');
            payOrder(orderId);
        });
    });

}
async function renderOrderDetails(orderId) {
    console.log(orderId);
    const orderDetails = document.querySelector('.order-details');
    const order = await fetchOrderDetails(orderId); // Fetch order details from server

    orderDetails.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Order Details</h3>
            </div>
            <div class="card-body">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                <p><strong>Order Date:</strong> ${(new Date(order.orderDate)).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <h4>Products</h4>
                <ul class="list-group">
                    ${order.order_bill_product.map((product) => `
                        <li class="list-group-item">
                            <p><strong>Name:</strong> ${product.productName}</p>
                            <p><strong>Price:</strong> ${product.price}</p>
                            <p><strong>Quantity:</strong> ${product.quantity}</p>
                            <p><strong>Total Price:</strong> ${product.totalPrice}</p>
                        </li>
                    `).join('')}
                </ul>
                <h4>Shipping Address</h4>
                <p><strong>Name:</strong> ${order.order_bill_address[0].firstName} ${order.order_bill_address[0].lastName}</p>
                <p><strong>Company:</strong> ${order.order_bill_address[0].company}</p>
                <p><strong>Country:</strong> ${order.order_bill_address[0].country}</p>
                <p><strong>Address:</strong> ${order.order_bill_address[0].address}</p>
                <p><strong>Post Code:</strong> ${order.order_bill_address[0].postCode}</p>
                <p><strong>City:</strong> ${order.order_bill_address[0].city}</p>
                <p><strong>Province:</strong> ${order.order_bill_address[0].province}</p>
                <p><strong>Phone:</strong> ${order.order_bill_address[0].phone}</p>
                <p><strong>Email:</strong> ${order.order_bill_address[0].email}</p>
            </div>
        </div>
    `;

    async function fetchOrderDetails(orderId) {
        try {
            const response = await fetch(`/api/v1/order/info/${orderId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }
            const order = await response.json();
            return order.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    }
}

async function payOrder(orderId) {
    try {
        const response = await fetch(`/api/v1/order/vnpay/${orderId}`)

        if (!response.ok) {
            throw new Error('Failed to pay order');
        }

        const result = await response.json();
        if (result.data) {
            window.location.href = result.data;
        }
    } catch (error) {
        console.error('Error paying order:', error);
    }
}

loadOrders();