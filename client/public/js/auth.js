const token = localStorage.getItem('token');
const navbar = document.querySelector('#nav');
if (token) {
    const logoutButton = document.createElement('li.nav-item')
    logoutButton.innerHTML = `<a href = "#" class="nav-link" >Logout</a>`;
    logoutButton.addEventListener('click', async () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    })
    navbar.appendChild(logoutButton);
}

else {
    const loginButton = document.createElement('li.nav-item')
    loginButton.innerHTML = `<a class="nav-link" href="/auth/login">Login</a>`;
    navbar.appendChild(loginButton);
}
