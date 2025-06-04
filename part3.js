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
