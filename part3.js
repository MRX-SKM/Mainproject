// --- Utility Functions (Conceptual Module 1: Auth & Storage) ---
const Auth = (function() {
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
    if (users[Email]) {
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
    logout
  };
})();

// --- UI Management (Conceptual Module 2: UIManager) ---
// Member 1 focuses on the parts related to login/app screen toggling and messages
const UIManager = (function() {
  const loginSection = document.getElementById('login-section');
  const mainAppContainer = document.getElementById('main-app-container');
  const loginError = document.getElementById('login-error');
  // Other DOM elements will be added by other members or in a combined UIManager

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
    // Ensure elements managed by other members are also hidden if necessary
    const blankPagePlaceholder = document.getElementById('blank-page-placeholder'); // From M3
    if (blankPagePlaceholder) blankPagePlaceholder.style.display = 'none';
  }

  function showAppScreen() {
    if (loginSection) loginSection.style.display = 'none';
    if (mainAppContainer) mainAppContainer.style.display = 'flex';
    document.body.style.justifyContent = 'flex-start';
    clearMessage();

    // Reset app content (calls to functions that might be expanded by M2/M3)
    // For now, just basic resets. UIManager.showMainAppContent will handle specifics.
    const resumeTextArea = document.getElementById('resume-text'); // From M2/M3
    if (resumeTextArea) resumeTextArea.value = '';
    const pdfUploadInput = document.getElementById('pdf-upload-input'); // From M2
    if (pdfUploadInput) pdfUploadInput.value = '';
    // Add clearing for other file inputs from M2
    const docToPdfInput = document.getElementById('doc-to-pdf-upload-input');
    if (docToPdfInput) docToPdfInput.value = '';
    const imgToPdfInput = document.getElementById('img-to-pdf-upload-input');
    if (imgToPdfInput) imgToPdfInput.value = '';
    const htmlToPdfInput = document.getElementById('html-to-pdf-upload-input');
    if (htmlToPdfInput) htmlToPdfInput.value = '';


    const resultsPre = document.getElementById('results'); // From M3
    if (resultsPre) resultsPre.style.display = 'none';
    const loadingDiv = document.getElementById('loading'); // From M3
    if (loadingDiv) loadingDiv.style.display = 'none';
    const nextPageBtn = document.getElementById('next-page-btn'); // From M3
    if (nextPageBtn) nextPageBtn.style.display = 'none';

    // Call a more comprehensive reset/show function for the app's main content area
    // This function will be fully defined/expanded by M3
     if (typeof UIManager.showMainAppContent === 'function') {
        UIManager.showMainAppContent();
    }
  }

  // Placeholder for showMainAppContent - M3 will expand this
  // UIManager.showMainAppContent = function() { /* ... M3's logic ... */ };

  return {
    showMessage,
    clearMessage,
    showLoginScreen,
    showAppScreen,
    // Expose other functions as they are built by other members
  };
})();

// --- Main Application Logic (Event Listeners for Auth) ---
// DOM Elements for Auth
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const homeBtn = document.getElementById('home-btn'); // Basic navigation
const toggleRegisterBtn = document.getElementById('toggle-register');
const formTitle = document.getElementById('form-title');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

let isRegisterMode = false;

// Event Listeners for Auth
if (toggleRegisterBtn) {
  toggleRegisterBtn.addEventListener('click', () => {
    UIManager.clearMessage();
    isRegisterMode = !isRegisterMode;
    formTitle.textContent = isRegisterMode ? 'Register New Account' : 'Techpro Login';
    loginBtn.textContent = isRegisterMode ? 'Register' : 'Log In';
    toggleRegisterBtn.textContent = isRegisterMode ? 'Already have an account? Log In' : "Don't have an account? Register";
    emailInput.value = '';
    passwordInput.value = '';
  });
}

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    UIManager.clearMessage();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      UIManager.showMessage('Please enter both email and password.');
      return;
    }

    if (isRegisterMode) {
      if (Auth.register(email, password)) {
        UIManager.showMessage('Registration successful! You can now log in.', false);
        isRegisterMode = false;
        formTitle.textContent = 'Techpro Login';
        loginBtn.textContent = 'Log In';
        toggleRegisterBtn.textContent = "Don't have an account? Register";
        emailInput.value = ''; // Clear fields for login
        passwordInput.value = '';
      } else {
         if (Auth.login(email, password)) { // Check if it was a registration attempt for existing user with correct pass
            Auth.setLoggedInUser(email);
            UIManager.showAppScreen();
          } else {
            UIManager.showMessage('This email is already registered. Try logging in or use a different password if this was a mistake during registration.');
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

