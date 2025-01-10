import { UserData } from "../../user";

export function profileRender(user: UserData) {
return `
<div class="card-body">
    <div class="form-group">
        <label for="avatar">Avatar</label>
        <div>
            <img src="${user.avatar}" alt="User Avatar"
                class="img-thumbnail" id="avatar" style="border-radius: 50%; width: 150px; height: 150px;">
        </div>
    </div>
    <div class="form-group">
        <label for="name">Name</label>
        <p id="name">${user.name}</p>
    </div>
    <div class="form-group">
        <label for="username">Username</label>
        <p id="username">${user.username}</p>
    </div>
    <div class="form-group">
        <label for="email">Email</label>
        <p id="email">${user.email}</p>
    </div>
    <a href="/update-info">
        <button type="button" class="btn btn-primary" id="update-profile-btn">Update Profile</button></a>
</div>
`;
}