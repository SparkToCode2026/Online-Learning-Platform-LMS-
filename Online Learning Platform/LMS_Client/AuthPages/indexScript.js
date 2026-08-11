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

  // Tab switching logic
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    subtitle.textContent = "Join thousands of students and educators worldwide";
  });

  registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    subtitle.textContent = "Create your account to start learning and teaching";
  });

  // Password visibility toggle
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      loginPasswordInput.type = loginPasswordInput.type === 'password' ? 'text' : 'password';
    });
  }

  // Radio button styling selection
  roleInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'student') {
        studentOpt.classList.add('selected');
        instructorOpt.classList.remove('selected');
      } else {
        instructorOpt.classList.add('selected');
        studentOpt.classList.remove('selected');
      }
    });
  });
});