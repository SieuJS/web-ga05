const { time } = require("console");

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login100-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Get form values
        const fullname = form.querySelector('input[name="fullname"]').value;
        const username = form.querySelector('input[name="username"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="pass"]').value;
        const confirmPassword = form.querySelector('input[name="confirm_pass"]').value;
        const errorElement = document.querySelector('#error');
        const errorTextElement = document.querySelector('#error-text');
        const successElement = document.querySelector('#success');
        const successTextElement = document.querySelector('#success-text');
        if (errorElement.classList.contains('d-none'))
            errorElement.classList.add('d-none');
        if (successElement.classList.contains('d-none'))
            successElement.classList.add('d-none');

        errorTextElement.textContent = '';
        successElement.textContent = '';

        // Validate form inputs
        if (!fullname || !username || !email || !password || !confirmPassword) {
            errorElement.classList.remove('d-none');
            errorTextElement.textContent = "Please fill in all fields.";
            return;
        }

        if (password !== confirmPassword) {
            errorElement.classList.remove('d-none');
            errorTextElement.textContent = "Passwords do not match.";
            return;
        }

        // Prepare data to be sent to the API
        const userData = {
            email: email,
            name: fullname,
            password: password,
            role: "user",  // Assuming default role is 'user'
        };

        try {
            // Send data to API
            const response = await fetch('/api/v1/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const responseData = await response.json();

            // Check if the request was successful
            if (response.ok) {
                // Handle success
                successElement.classList.remove('d-none');
                successTextElement.textContent = "Registration successful. Redirecting to home page...";
                localStorage.setItem('token',  responseData.token);
                setTimeout(() => {
                    window.location.href = '/'; // Redirect to home page
                }, 2000);
                // Redirect to login page
            } else {
                // Handle error (e.g., email already exists)
                errorElement.classList.remove('d-none');
                errorTextElement.textContent = responseData.message;
                timeOut(() => {
                    errorElement.classList.add('d-none');
                }, 3000);
            }
        } catch (error) {
            // Handle network errors
            console.error('Error:', error);
            alert('There was an error processing your request.');
        }
    });
});
