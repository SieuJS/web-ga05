export const isLogged = async () => {
    
    try {
        const res = await fetch ('/api/v1/user/protected');
        if(!res.ok){
            throw new Error('Not logged in');
        }
        return true;  
    }
    catch (error) {
        return 0;
    }
};

const navbar = document.querySelector('#nav');
(async () =>{
    if (await isLogged()) {
        const logoutButton = document.createElement('li.nav-item')
        logoutButton.innerHTML = `<a href = "#" class="nav-link" >Logout</a>`;
        logoutButton.addEventListener('click', async () => {
    
            await fetch('/api/v1/user/logout');
            localStorage.removeItem('token');
            window.location.href = '/';
        })
        const orderButton = document.createElement('li.nav-item')
        orderButton.innerHTML = `<a class="nav-link" href="/order">Orders</a>`;
        navbar.appendChild(logoutButton);
        navbar.appendChild(orderButton);
    }
    
    else {
        const loginButton = document.createElement('li.nav-item')
        loginButton.innerHTML = `<a class="nav-link" href="/auth/login">Login</a>`;
        navbar.appendChild(loginButton);
    }
})();
