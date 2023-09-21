const token = sessionStorage.getItem('token');
const roles = sessionStorage.getItem('roles');
const email = sessionStorage.getItem('email');

console.log(token);
console.log(roles);
console.log(email);

if (roles == null || !roles.includes("ROLE_ADMIN")) {
    window.location.href = 'http://127.0.0.1:5500/unAuthorization.html';
}