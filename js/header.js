const token = sessionStorage.getItem('token');
const roles = sessionStorage.getItem('roles');
const email = sessionStorage.getItem('email');

console.log(token);
console.log(roles);
console.log(email);

// Check if the user is logged in
var isLoggedIn = false;
if (token != null) isLoggedIn = true;

// Select the necessary elements
var btnLogin = document.querySelector('.btn-login');
var btnRegister = document.querySelector('.btn-register');
var btnProfile = document.querySelector('.btn-profile');
var btnCart = document.querySelector('.btn-cart');

// Toggle visibility of login/register or profile/cart based on login status
if (isLoggedIn) {
    btnLogin.style.display = 'none';
    btnRegister.style.display = 'none';
    btnProfile.style.display = 'inline';
    btnCart.style.display = 'inline';
} else {
    btnLogin.style.display = 'inline';
    btnRegister.style.display = 'inline';
    btnProfile.style.display = 'none';
    btnCart.style.display = 'none';
}

btnLogin.addEventListener('click', function () {
    window.location.href = 'login.html';
})
btnProfile.addEventListener('click', function () {
    window.location.href = 'uProfile.html';
})

