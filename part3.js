HEAD
// Event listener for form submission (login/register)
if (authForm) {
  authForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = emailInput.value;
    const password = passwordInput.value;

    // Determine if it's a registration or login attempt
    if (isRegistering) {
      if (Auth.register(email, password)) {
        Auth.setLoggedInUser(email);
        UIManager.showAppScreen();
      } else {
        UIManager.showMessage('Registration failed. This email might already be registered or passwords do not match.');

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
 948709e84ecfd660f6507a21bd9954f20a47186e
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

 HEAD
// Event listener for toggling between login and register forms
if (toggleRegisterBtn) {
  toggleRegisterBtn.addEventListener('click', () => {
    isRegistering = !isRegistering; // Toggle the state

    const formTitle = document.getElementById('formTitle');
    const loginBtn = document.getElementById('loginBtn');
    const toggleRegisterBtn = document.getElementById('toggleRegisterBtn');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    if (isRegistering) {
      formTitle.textContent = 'Techpro Register';
      loginBtn.textContent = 'Register';
      toggleRegisterBtn.textContent = 'Already have an account? Log In';
      emailInput.value = ''; // Clear fields for registration
      passwordInput.value = '';
    } else {
      formTitle.textContent = 'Techpro Login';
      loginBtn.textContent = 'Log In';
      toggleRegisterBtn.textContent = "Don't have an account? Register";
      emailInput.value = ''; // Clear fields for login
      passwordInput.value = '';
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    Auth.logout();
    UIManager.showLoginScreen();
  });
}

if (homeBtn) {
  homeBtn.addEventListener('click', () => {
    // This should reset the app view to its initial state after login
    // UIManager.showMainAppContent will be fully implemented by Member 3
    if (typeof UIManager.showMainAppContent === 'function') {
      UIManager.showMainAppContent();
    } else { // Basic fallback if M3 part not integrated yet
      UIManager.showAppScreen(); // Resets some elements
    }
    // Member 3 might add clearing of matchedCompaniesList here
    // matchedCompaniesList = [];
  });
}

// Initial setup on page load (Auth part)
window.addEventListener('load', () => {
  Auth.initDefaultUser();
  if (Auth.getLoggedInUser()) {
    UIManager.showAppScreen();
  } else {
    UIManager.showLoginScreen();
  }
  // Chatbot.init(); // This will be called by Member 4
});
948709e84ecfd660f6507a21bd9954f20a47186e
