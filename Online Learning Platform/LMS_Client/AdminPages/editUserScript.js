import { getUserById, updateUser } from '../APIs/UserAPI.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('edit-user-form');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const messageBox = document.getElementById('form-message');
  const submitBtn = document.getElementById('btn-submit');

  // Get user ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');

  function showMessage(text, isError = false) {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.className = `form-message-box ${isError ? 'error-msg' : 'success-msg'}`;
    messageBox.style.display = 'block';
  }

  if (!userId) {
    showMessage('No user ID provided. Redirecting back to user list...', true);
    if (form) {
      const inputs = form.querySelectorAll('input, button');
      inputs.forEach(input => input.disabled = true);
    }
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 2000);
    return;
  }

  // Load user data to pre-fill the form
  try {
    const user = await getUserById(userId);
    if (user) {
      const fullName = user.fullName || user.FullName || user.userName || user.UserName || '';
      const email = user.email || user.Email || user.userEmail || user.UserEmail || '';
      
      if (nameInput) nameInput.value = fullName;
      if (emailInput) emailInput.value = email;
    }
  } catch (err) {
    showMessage(`Failed to load user details: ${err.message}`, true);
  }

  // Form submit handler
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      if (!fullName || !email) {
        showMessage('Please fill in both name and email fields.', true);
        return;
      }

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Updating...';
        }

        await updateUser(userId, fullName, email);
        showMessage('User updated successfully! Redirecting...', false);

        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 1200);
      } catch (err) {
        showMessage(err.message || 'Failed to update user.', true);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Update User';
        }
      }
    });
  }
});
