
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(";").shift();
}

const userId = getCookie("userId");
console.log("user id =",userId)

const response = await fetch(`http://localhost:3000/api/users/${userId}`);
const userData = await response.json();

document.querySelector(".profile-img img").src = userData.avatar || "/images/default-avatar.jpg";
document.querySelector(".profile-name").textContent = userData.name;
document.querySelector(".profile-role").textContent = userData.role;
document.querySelector(".profile-location").textContent = userData.address;
document.querySelector(".profile-company").textContent = userData.company;
document.querySelector(".profile-phone").textContent = userData.phone;
document.querySelector(".profile-email").textContent = userData.email;