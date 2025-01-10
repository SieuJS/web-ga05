document.getElementById('submit-form').addEventListener('click', function(
    event) {
    const newPassword = document.getElementById('new-password')
        .value;
    console.log("clicked")
    const reNewPassword = document.getElementById('re-new-password')
        .value;
    if (newPassword !== reNewPassword) {
        event.preventDefault();
        alert('New passwords do not match!');
    } else {
        console.log("get in")
        const avatar = document.querySelector('#avatar').value;
        const newPassword = document.querySelector('#new-password')
            .value;
        const oldPassword = document.querySelector('#old-password')
            .value;
        console.log({
            newPassword,
            oldPassword,
            avatar
        })
        
        event.preventDefault();
    }
});