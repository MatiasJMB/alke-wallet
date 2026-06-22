// Maneja los datos de la app (usuarios, sesión, saldo, movimientos y contactos).
// Como no hay backend, todo se guarda en localStorage.

const AlkeStore = (() => {
  const USERS_KEY = 'alke_users';
  const SESSION_KEY = 'alke_session';
  const VERSION_KEY = 'alke_version';
  // Si cambia la estructura de los datos, subimos esto para reiniciar lo guardado.
  const VERSION = '2';

  // Usuario de prueba para poder entrar sin tener que registrarse.
  const seedUsers = [
    {
      id: 1,
      name: 'Camila Soto',
      email: 'demo@alkewallet.com',
      password: 'alkemy123',
      balance: 250000,
      transactions: [
        { id: 1001, type: 'deposit', amount: 150000, concept: 'Depósito inicial', counterpart: 'Banco Estado', date: '2026-06-01T10:15:00' },
        { id: 1002, type: 'send', amount: 30000, concept: 'Pago arriendo', counterpart: 'Inmobiliaria Andes', date: '2026-06-05T18:40:00' },
        { id: 1003, type: 'receive', amount: 130000, concept: 'Reembolso', counterpart: 'Lucas Pérez', date: '2026-06-12T09:05:00' },
      ],
      contacts: [
        { id: 2001, name: 'Lucas Pérez', account: 'lucas.perez@alkewallet.com' },
        { id: 2002, name: 'María González', account: 'maria.gonzalez@alkewallet.com' },
        { id: 2003, name: 'Inmobiliaria Andes', account: 'pagos@inmoandes.cl' },
      ],
    },
  ];

  // Lee y parsea una clave; si está corrupta o no existe, devuelve el respaldo.
  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function getUsers() {
    return read(USERS_KEY, []);
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Carga los datos de prueba la primera vez (o si la versión guardada quedó vieja).
  function init() {
    if (localStorage.getItem(VERSION_KEY) !== VERSION) {
      saveUsers(seedUsers);
      localStorage.removeItem(SESSION_KEY);
      localStorage.setItem(VERSION_KEY, VERSION);
    }
  }

  function register({ name, email, password }) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'Ya existe una cuenta con ese correo.' };
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      balance: 0,
      transactions: [],
      contacts: [],
    };

    users.push(newUser);
    saveUsers(users);
    return { ok: true, user: newUser };
  }

  function login(email, password) {
    const user = getUsers().find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      return { ok: false, message: 'Correo o contraseña incorrectos.' };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
    return { ok: true, user };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getCurrentUser() {
    const session = read(SESSION_KEY, null);
    if (!session) return null;

    const user = getUsers().find((u) => u.id === session.userId);
    // Si la sesión apunta a un usuario que ya no existe, la limpiamos.
    if (!user) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return user;
  }

  function isAuthenticated() {
    return getCurrentUser() !== null;
  }

  // Guarda los cambios de un usuario (saldo, movimientos, contactos).
  function updateUser(user) {
    saveUsers(getUsers().map((u) => (u.id === user.id ? user : u)));
  }

  function deposit(amount, concept) {
    const user = getCurrentUser();
    if (!user) return { ok: false, message: 'Sesión no válida.' };
    if (!(amount > 0)) return { ok: false, message: 'El monto debe ser mayor a cero.' };

    user.balance += amount;
    user.transactions.push({
      id: Date.now(),
      type: 'deposit',
      amount,
      concept: concept || 'Depósito de fondos',
      counterpart: 'Recarga',
      date: new Date().toISOString(),
    });
    updateUser(user);
    return { ok: true, balance: user.balance };
  }

  function sendMoney({ counterpart, amount, concept }) {
    const user = getCurrentUser();
    if (!user) return { ok: false, message: 'Sesión no válida.' };
    if (!(amount > 0)) return { ok: false, message: 'El monto debe ser mayor a cero.' };
    if (amount > user.balance) {
      return { ok: false, message: 'Saldo insuficiente para realizar la transferencia.' };
    }

    user.balance -= amount;
    user.transactions.push({
      id: Date.now(),
      type: 'send',
      amount,
      concept: concept || 'Transferencia',
      counterpart,
      date: new Date().toISOString(),
    });
    updateUser(user);
    return { ok: true, balance: user.balance };
  }

  function withdraw(amount, concept) {
    const user = getCurrentUser();
    if (!user) return { ok: false, message: 'Sesión no válida.' };
    if (!(amount > 0)) return { ok: false, message: 'El monto debe ser mayor a cero.' };
    if (amount > user.balance) {
      return { ok: false, message: 'Saldo insuficiente para realizar el retiro.' };
    }

    user.balance -= amount;
    user.transactions.push({
      id: Date.now(),
      type: 'withdraw',
      amount,
      concept: concept || 'Retiro de fondos',
      counterpart: 'Retiro',
      date: new Date().toISOString(),
    });
    updateUser(user);
    return { ok: true, balance: user.balance };
  }

  function getBalance() {
    const user = getCurrentUser();
    return user ? user.balance : 0;
  }

  // Movimientos del más reciente al más antiguo.
  function getTransactions() {
    const user = getCurrentUser();
    if (!user) return [];
    return [...user.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function getContacts() {
    const user = getCurrentUser();
    return user ? user.contacts : [];
  }

  function addContact({ name, account }) {
    const user = getCurrentUser();
    if (!user) return { ok: false, message: 'Sesión no válida.' };
    if (user.contacts.some((c) => c.account.toLowerCase() === account.toLowerCase())) {
      return { ok: false, message: 'Ese contacto ya está en tu agenda.' };
    }

    const contact = { id: Date.now(), name: name.trim(), account: account.trim() };
    user.contacts.push(contact);
    updateUser(user);
    return { ok: true, contact };
  }

  function searchContacts(query) {
    const term = query.trim().toLowerCase();
    if (!term) return getContacts();
    return getContacts().filter(
      (c) => c.name.toLowerCase().includes(term) || c.account.toLowerCase().includes(term)
    );
  }

  return {
    init, register, login, logout, getCurrentUser, isAuthenticated,
    deposit, withdraw, sendMoney, getBalance, getTransactions,
    getContacts, addContact, searchContacts,
  };
})();

AlkeStore.init();
