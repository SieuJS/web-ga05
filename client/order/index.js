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

                <td>${order.userId}</td>
                <td>${order.status}</td>
                <td>${order.orderDate}</td>
            </tr>
        `;
    }).join(' ');
}

loadOrders();