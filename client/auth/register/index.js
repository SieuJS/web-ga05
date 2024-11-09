document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login100-form');
    console.log(form);
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const fullname = form.querySelector('input[name="fullname"]').value;
        const username = form.querySelector('input[name="username"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="pass"]').value;
        const confirmPassword = form.querySelector('input[name="confirm_pass"]').value;

        // Validate form inputs
        if (!fullname || !username || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
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
            const response = await fetch('/api/v1/user', {
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
                alert('Account created successfully!');
                window.location.href = '/auth/login'; // Redirect to login page
            } else {
                // Handle error (e.g., email already exists)
                alert(`Error: ${responseData.message || 'Something went wrong'}`);
            }
        } catch (error) {
            // Handle network errors
            console.error('Error:', error);
            alert('There was an error processing your request.');
        }
    });
});
