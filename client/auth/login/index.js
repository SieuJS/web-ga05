
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target['email'].value ;
    const password = e.target['pass'].value ; 
    const errorElement = document.querySelector('#error');
    const errorMessageElement = document.querySelector('#error-text');
    const successfulElement = document.querySelector('#success');
    const successMessageElement = document.querySelector('#success-text');
    if(errorElement.classList.contains('d-none')){
        errorElement.classList.add('d-none');
    }
    if(successfulElement.classList.contains('d-none')){
        successfulElement.classList.add('d-none');
    }
    errorMessageElement.textContent = '';
    successMessageElement.textContent = '';

    const response = await fetch('/api/v1/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
            const error = await response.json();
        console.error('Login failed:', error);


        errorElement.classList.remove('d-none');
        errorMessageElement.textContent = error.message;
        setTimeout(() => {
            errorElement.classList.add('d-none');
            errorMessageElement.textContent = '';
        }, 3000);
        return;
    }

    const data = await response.json();
    console.log('Login successful:', data);
    successMessageElement.classList.remove('d-none');
    successMessageElement.textContent = "Login success, wait for redirecting to shop page";
    localStorage.setItem('token',  data.token);
    setTimeout(() => {
        window.location.href = '/shop';
    }, 2000);

});
