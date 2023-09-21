const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorDiv = document.getElementById('error');

const url = 'http://localhost:8080/api/v1/login';

form.addEventListener('submit', function (event) {
  event.preventDefault(); // Ngăn chặn việc submit form
  const email = emailInput.value;
  const password = passwordInput.value;

  // Tạo đối tượng XMLHttpRequest
  const xhr = new XMLHttpRequest();

  // Thiết lập phương thức và endpoint cho request
  xhr.open('POST', url);

  // Thiết lập header cho request (nếu cần)
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Thiết lập callback khi request hoàn thành
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      console.log(response);
      errorDiv.textContent = '';

      // Lưu mã token vào session storage
      sessionStorage.setItem('token', response.jwt);
      sessionStorage.setItem('roles', response.roles);
      sessionStorage.setItem('email', response.email);

      const roles = Array.from(response.roles);
      if (roles.includes("ROLE_ADMIN"))
        window.location.href = "./AdminHome.html";
      else
        window.location.href = "uFilms.html";
    } else {
      // Xử lý lỗi khi request không thành công
      console.error('Request failed. Status code:', xhr.status);
      errorDiv.textContent = 'Incorrect email or password.';
    }
  };

  // Gửi request với dữ liệu trong body
  const data = { email: email, password: password };
  xhr.send(JSON.stringify(data));
});


const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close");
console.log(closeModal);
closeModal.addEventListener('click', function (event) {
  modal.style.display = 'none';
});

const register = document.getElementById('register-button');
register.addEventListener('click', function (event) {
  modal.style.display = 'block';
});

const emailRegister = document.getElementById('reg-email');
const passwordRegister = document.getElementById('reg-password');
const confirmPasswordRegister = document.getElementById('reg-confirm-password');
const otpRegister = document.getElementById('reg-otp');
const submitRegister = document.getElementById('register-submit');
const getOtp = document.getElementById('get-otp');
const error = document.getElementById('register-error');

function validateEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

emailRegister.addEventListener("input", () => {
  console.log(emailRegister.value);
});

getOtp.addEventListener('click', () => {
  if (validateEmail(emailRegister.value)
    && passwordRegister.value == confirmPasswordRegister.value) {
    console.log("email chinh xấc");
    getOTP(emailRegister.value)
  }
  else console.log("sai");

});

async function getOTP(email) {
  const response = await fetch('http://localhost:8080/api/v1/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: passwordRegister.value
    })
  });
  console.log(response.json());
}

const registerForm = document.getElementById('register-modal');
submitRegister.addEventListener('click', function () {
  fetch('http://localhost:8080/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: emailRegister.value,
      password: passwordRegister.value,
      otp : otpRegister.value
    })
  });
})
