
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login100-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        const submitRequestButton = document.querySelector('.submit-request-button');
        const loadingContent = '<span class="loader" role="status" aria-hidden="true"></span> Loading...';
        const idleContent = 'Sign Up';

        submitRequestButton.innerHTML = loadingContent;
        
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
        if (!errorElement.classList.contains('d-none'))
            errorElement.classList.add('d-none');
        if (!successElement.classList.contains('d-none'))
            successElement.classList.add('d-none');

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
            username : username,
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
            console.log("Response data:", responseData);
            // Check if the request was successful
            if (response.ok) {
                // Handle success
                successElement.classList.remove('d-none');
                successTextElement.textContent =`Registration successful. Redirecting to home page...`;

                await fetch('/api/v1/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                setTimeout(() => {
                    window.location.href = '/'; // Redirect to home page
                }, 2000);
                // Redirect to login page
            } else {
                // Handle error (e.g., email already exists)
                throw new Error(responseData.message);

            }
        } catch (error) {
            // Handle network errors
            errorElement.classList.remove('d-none');
            errorTextElement.textContent = error.message;
            submitRequestButton.innerHTML = "Sign Up";
            timeOut(() => {
                errorElement.classList.add('d-none');
            }, 3000);
            return;
        }
    });
});
