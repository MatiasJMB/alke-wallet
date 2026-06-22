// Maneja el inicio de sesión y el registro. Sin jQuery, JS puro.

(() => {
  // Si ya hay sesión, no tiene sentido mostrar el login.
  if (AlkeStore.isAuthenticated()) {
    window.location.replace('menu.html');
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const alertBox = document.getElementById('authAlert');

    function showError(message) {
      alertBox.textContent = message;
      alertBox.className = 'alert alert-danger';
    }

    function clearError() {
      alertBox.className = 'alert d-none';
    }

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      if (!loginForm.checkValidity()) {
        loginForm.classList.add('was-validated');
        return;
      }

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const result = AlkeStore.login(email, password);

      if (result.ok) {
        window.location.href = 'menu.html';
      } else {
        showError(result.message);
      }
    });

    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      if (!registerForm.checkValidity()) {
        registerForm.classList.add('was-validated');
        return;
      }

      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      const result = AlkeStore.register({ name, email, password });

      if (!result.ok) {
        showError(result.message);
        return;
      }

      // Lo dejamos logueado y entramos directo.
      AlkeStore.login(email, password);
      window.location.href = 'menu.html';
    });
  });
})();
