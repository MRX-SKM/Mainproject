// DOM Elements for Auth
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const homeBtn = document.getElementById('home-btn');
const toggleRegisterBtn = document.getElementById('toggle-register');
const formTitle = document.getElementById('form-title');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// ✅ Added DOM elements for username and show password
const usernameInput = document.getElementById('username');
const showPasswordCheckbox = document.getElementById('show-password');

// ✅ Password visibility toggle logic
if (showPasswordCheckbox && passwordInput) {
  showPasswordCheckbox.addEventListener('change', () => {
    passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
  });
}

let isRegisterMode = false;

if (toggleRegisterBtn) {
  toggleRegisterBtn.addEventListener('click', () => {
    UIManager.clearMessage();
    isRegisterMode = !isRegisterMode;
    formTitle.textContent = isRegisterMode ? 'Register New Account' : 'Techpro Login';
    loginBtn.textContent = isRegisterMode ? 'Register' : 'Log In';
    toggleRegisterBtn.textContent = isRegisterMode ? 'Already have an account? Log In' : "Don't have an account? Register";
    emailInput.value = '';
    passwordInput.value = '';

    // ✅ Clear username on toggle
    if (usernameInput) usernameInput.value = '';
  });
}

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    UIManager.clearMessage();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    const username = usernameInput ? usernameInput.value.trim() : ''; // ✅ Grab username if present

    if (!email || !password || (isRegisterMode && !username)) {
      UIManager.showMessage('Please fill all required fields.');
      return;
    }

    if (isRegisterMode) {
      if (Auth.register(email, password)) {
        UIManager.showMessage('Registration successful! You can now log in.', false);
        isRegisterMode = false;
        formTitle.textContent = 'Techpro Login';
        loginBtn.textContent = 'Log In';
        toggleRegisterBtn.textContent = "Don't have an account? Register";
        emailInput.value = '';
        passwordInput.value = '';
        if (usernameInput) usernameInput.value = '';
      } else {
        if (Auth.login(email, password)) {
          Auth.setLoggedInUser(email);
          UIManager.showAppScreen();
        } else {
          UIManager.showMessage('This email is already registered. Try logging in or use a different password.');
        }
      }
    } else {
      if (Auth.login(email, password)) {
        Auth.setLoggedInUser(email);
        UIManager.showAppScreen();
      } else {
        UIManager.showMessage('Invalid email or password.');
      }
    }
  });
}

