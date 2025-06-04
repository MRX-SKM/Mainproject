// --- Utility Functions (Conceptual Module 1: Auth & Storage) ---
const Auth = (function () {
  function loadUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function initDefaultUser() {
    let users = loadUsers();
    if (!users['user@example.com']) {
      users['user@example.com'] = 'TechproSecure123';
      saveUsers(users);
    }
  }

  function login(email, password) {
    const users = loadUsers();
    return users[email] && users[email] === password;
  }

  function register(email, password) {
    let users = loadUsers();
    if (users[email]) {
      return false; // User already exists
    }
    users[email] = password;
    saveUsers(users);
    return true;
  }

  function setLoggedInUser(email) {
    localStorage.setItem('loggedInUser', email);
  }

  function getLoggedInUser() {
    return localStorage.getItem('loggedInUser');
  }

  function logout() {
    localStorage.removeItem('loggedInUser');
  }

  return {
    initDefaultUser,
    login,
    register,
    setLoggedInUser,
    getLoggedInUser,
    logout,
  };
})();

// --- UI Management (Conceptual Module 2: UIManager) ---
const UIManager = (function () {
  const loginSection = document.getElementById('login-section');
  const mainAppContainer = document.getElementById('main-app-container');
  const loginError = document.getElementById('login-error');

  function showMessage(message, isError = true) {
    loginError.textContent = message;
    loginError.className = isError ? 'alert' : 'alert success';
    loginError.style.display = 'block';
    loginError.setAttribute('aria-live', 'assertive');
  }

  function clearMessage() {
    loginError.textContent = '';
    loginError.style.display = 'none';
    loginError.removeAttribute('aria-live');
  }

  function showLoginScreen() {
    if (mainAppContainer) mainAppContainer.style.display = 'none';
    if (loginSection) loginSection.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    clearMessage();

    const blankPagePlaceholder = document.getElementById('blank-page-placeholder');
    if (blankPagePlaceholder) blankPagePlaceholder.style.display = 'none';

    // 🔁 Autofocus email input for better UX
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
  }

  function showAppScreen() {
    if (loginSection) loginSection.style.display = 'none';
    if (mainAppContainer) mainAppContainer.style.display = 'flex';
    document.body.style.justifyContent = 'flex-start';
    clearMessage();

    // Reset all user inputs from Modules 2 & 3
    ['resume-text', 'pdf-upload-input', 'doc-to-pdf-upload-input', 'img-to-pdf-upload-input', 'html-to-pdf-upload-input'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.value = '';
    });

    ['results', 'loading', 'next-page-btn'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    if (typeof UIManager.showMainAppContent === 'function') {
      UIManager.showMainAppContent();
    }
  }

  return {
    showMessage,
    clearMessage,
    showLoginScreen,
    showAppScreen,
  };
})();

// --- Main Application Logic (Event Listeners for Auth) ---
=======
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
    toggleRegisterBtn.textContent = isRegisterMode
      ? 'Already have an account? Log In'
      : "Don't have an account? Register";
    emailInput.value = '';
    passwordInput.value = '';
    emailInput.focus(); // 🔁 Focus on email field when toggling mode
=======
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

    // 🔒 Password strength validation (basic check)
    if (isRegisterMode && password.length < 6) {
      UIManager.showMessage('Password must be at least 6 characters long.');
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
        emailInput.focus();
=======
        if (usernameInput) usernameInput.value = '';
      } else {
        if (Auth.login(email, password)) {
          Auth.setLoggedInUser(email);
          UIManager.showAppScreen();
        } else {
          UIManager.showMessage('Email already registered. Try logging in or use a different password.');
=======
          UIManager.showMessage('This email is already registered. Try logging in or use a different password.');
        }
      }
    } else {
      if (Auth.login(email, password)) {
        Auth.setLoggedInUser(email);
        UIManager.showAppScreen();
        UIManager.showMessage('Welcome back!', false); // ✅ Added welcome message
      } else {
        UIManager.showMessage('Invalid email or password.');
      }
    }
  });
}


if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    Auth.logout();
    UIManager.showLoginScreen();
    UIManager.showMessage('You’ve been logged out.', false); // ✅ Logout feedback
  });
}

if (homeBtn) {
  homeBtn.addEventListener('click', () => {
    if (typeof UIManager.showMainAppContent === 'function') {
      UIManager.showMainAppContent();
    } else {
      UIManager.showAppScreen();
    }
  });
}

// --- Initial Setup ---
window.addEventListener('load', () => {
  Auth.initDefaultUser();
  if (Auth.getLoggedInUser()) {
    UIManager.showAppScreen();
  } else {
    UIManager.showLoginScreen();
  }

  // Auto-focus email input on load for accessibility
  if (emailInput) emailInput.focus();

  // Chatbot.init(); // Reserved for M4
});

