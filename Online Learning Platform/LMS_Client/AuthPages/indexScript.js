import { loginUser, registerUser } from '../APIs/UserAPI.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const subtitle = document.getElementById('form-subtitle');
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const loginPasswordInput = document.getElementById('login-password');
  const roleInputs = document.querySelectorAll('input[name="role"]');
  const studentOpt = document.getElementById('student-option');
  const instructorOpt = document.getElementById('instructor-option');
  const errorMessageContainer = document.getElementById('errorMessage');
  const regErrorMessageContainer = document.getElementById('regErrorMessage');

  // Tab switching logic
  if (loginTab && registerTab && loginForm && registerForm) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
      if (subtitle) subtitle.textContent = "Join thousands of students and educators worldwide";
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
      if (subtitle) subtitle.textContent = "Create your account to start learning and teaching";
    });
  }

  // Password visibility toggle
  if (togglePasswordBtn && loginPasswordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      loginPasswordInput.type = loginPasswordInput.type === 'password' ? 'text' : 'password';
    });
  }

  // Radio button styling selection
  roleInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'student') {
        studentOpt?.classList.add('selected');
        instructorOpt?.classList.remove('selected');
      } else {
        instructorOpt?.classList.add('selected');
        studentOpt?.classList.remove('selected');
      }
    });
  });

  // Form submit listener for Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous error messages
      const errDiv = document.getElementById('errorMessage') || errorMessageContainer;
      if (errDiv) {
        errDiv.textContent = '';
      }

      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');

      const email = emailInput ? emailInput.value : '';
      const password = passwordInput ? passwordInput.value : '';

      try {
        const data = await loginUser(email, password);

        // Save token and user object (stringified) into localStorage
        if (data && data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Extract data.user.role (handling case-insensitivity)
        const role = (data && data.user && data.user.role) ? String(data.user.role).toLowerCase() : '';

        // Role-based redirection mapping
        const roleRedirects = {
          'admin': '../AdminPages/admin.html',
          'student': '../StudentPages/enrollment.html',
          'instructor': '../Instructor profile/instructor-profile-create.html'
        };

        if (roleRedirects[role]) {
          window.location.href = roleRedirects[role];
        } else {
          // Fallback for unknown roles: Display an error in the UI
          if (errDiv) {
            errDiv.textContent = `Unknown user role: ${data?.user?.role || 'Unspecified'}`;
          }
        }
      } catch (err) {
        // Output err.message inside <div id="errorMessage"></div>
        if (errDiv) {
          errDiv.textContent = err.message || 'An error occurred during login.';
        }
      }
    });
  }

  // Form submit listener for Register
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const regErrDiv = document.getElementById('regErrorMessage') || regErrorMessageContainer || errorMessageContainer;
      if (regErrDiv) {
        regErrDiv.textContent = '';
      }

      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const passwordInput = document.getElementById('reg-password');
      const selectedRole = document.querySelector('input[name="role"]:checked');

      const fullName = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';
      const rawRole = selectedRole ? selectedRole.value : 'student';

      // Format role to matching backend convention ("Student", "Instructor")
      const role = rawRole.charAt(0).toUpperCase() + rawRole.slice(1);

      try {
        const data = await registerUser(email, password, fullName, role);

        // Save token and user object into localStorage
        if (data && data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        const userRole = (data && data.user && data.user.role) ? String(data.user.role).toLowerCase() : rawRole.toLowerCase();

        const roleRedirects = {
          'admin': '../AdminPages/admin.html',
          'student': '../StudentPages/enrollment.html',
          'instructor': '../Instructor profile/instructor-profile-create.html'
        };

        if (roleRedirects[userRole]) {
          window.location.href = roleRedirects[userRole];
        } else {
          if (regErrDiv) {
            regErrDiv.textContent = `Registration succeeded, but unknown user role: ${data?.user?.role || 'Unspecified'}`;
          }
        }
      } catch (err) {
        if (regErrDiv) {
          regErrDiv.textContent = err.message || 'An error occurred during registration.';
        }
      }
    });
  }
});