const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
});

// Utility function for validations
function validatePassword(password) {
  const lengthCheck = password.length >= 8 && password.length <= 16;
  const uppercaseCheck = /[A-Z]/.test(password);
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return lengthCheck && uppercaseCheck && specialCharCheck;
}

function validateEmail(email) {
  const lowerCaseEmail = email.toLowerCase();
  const emailCheck = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(lowerCaseEmail);
  return emailCheck;
}

// Registration functionality
const registerForm = document.querySelector('.form-box.register .form');
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = registerForm.querySelector('input[placeholder="username"]').value.trim();
  const email = registerForm.querySelector('input[placeholder="E-mail"]').value.trim();
  const password = registerForm.querySelector('input[placeholder="password"]').value;
  // Empty fields check
  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  } 
  // Email validation
  if (!validateEmail(email)) {
    alert("Please enter a valid lowercase email with @ sign.");
    return;
  }

  // Password validation
  if (!validatePassword(password)) {
    alert("Password must be 8-16 characters, include at least 1 uppercase letter and 1 special character.");
    return;
  }

  // Store user data in localStorage
  const userData = {
    username: username,
    email: email.toLowerCase(),
    password: password
  };
  localStorage.setItem('user', JSON.stringify(userData));
  alert("Registered successfully! Now login.");
  container.classList.remove('active');
});

// Login functionality
const loginForm = document.querySelector('.form-box.login .form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); //e.preventDefault();: Bahut Important! By default, jab form submit hota hai toh page reload ho jaata hai. Yeh line page ko reload hone se rokti hai (prevents).                                    

  const username = loginForm.querySelector('input[placeholder="username"]').value.trim();
  const password = loginForm.querySelector('input[placeholder="password"]').value;

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const savedUser = JSON.parse(localStorage.getItem('user'));

  if (savedUser && savedUser.username === username && savedUser.password === password) {
    alert("Login successful!");
    window.location.href = "main.html";
  } else {
    alert("Invalid username or password.");
  }
});
  