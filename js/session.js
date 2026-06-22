// Protege las pantallas internas: si no hay sesión, vuelve al login.
// También pone el nombre del usuario en la navbar y conecta el botón de salir.

(() => {
  const user = AlkeStore.getCurrentUser();

  if (!user) {
    window.location.replace('login.html');
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-user-name]').forEach((el) => {
      el.textContent = user.name;
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        AlkeStore.logout();
        window.location.replace('login.html');
      });
    }
  });
})();
