// client/js/auth.js
'use strict';

// ================================
// Config
// ================================
const API_BASE_URL = 'http://localhost:3000/api/auth'; // change if your backend URL/port changes

const ROUTES = {
login: '/login',
register: '/register',
reset: '/reset',
};

// ================================
// Tiny helpers
// ================================
const $ = (id) => document.getElementById(id);
const show = (id) => $(id)?.classList.remove('hidden');
const hide = (id) => $(id)?.classList.add('hidden');

async function api(path, method = 'GET', body = null, token = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  if (token) opts.headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, opts);
  let data = {};
  try {
    data = await res.json();
  } catch (_) {
    // non-JSON response
  }
  if (!res.ok) {
    throw new Error(data.message || res.statusText || 'Request failed');
  }
  return data;
}

// ================================
// Forms & screens (guarded so code doesn't break if element is absent)
// ================================
const loginForm = $('loginForm');
const registerForm = $('registerForm');
const resetForm = $('resetForm');

const loginScreen = $('loginScreen');
const registrationScreen = $('registrationScreen');
const resetScreen = $('resetScreen');

const showRegisterBtn = $('showRegister');
const showLoginBtn = $('showLogin');
const showResetBtn = $('showReset');
const showLoginFromResetBtn = $('showLoginFromReset');

// ================================
// Event handlers
// ================================

// ---- Login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('loginEmail').value;
    const password = $('loginPassword').value;

    try {
      const data = await api(ROUTES.login, 'POST', { email, password });
      alert('Login successful!');
      localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html'; // change if needed
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.message);
    }
  });
}

// ---- Register
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('registerName').value;
    const email = $('registerEmail').value;
    const password = $('registerPassword').value;

    try {
      await api(ROUTES.register, 'POST', { name, email, password });
      alert('Registration successful! You can now log in.');
      if (registrationScreen && loginScreen) {
        hide('registrationScreen');
        show('loginScreen');
      }
      registerForm.reset();
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed: ' + err.message);
    }
  });
}

// ---- Reset password
if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('resetEmail').value;

    try {
      await api(ROUTES.reset, 'POST', { email });
      alert('Reset link sent to your email!');
      if (resetScreen && loginScreen) {
        hide('resetScreen');
        show('loginScreen');
      }
      resetForm.reset();
    } catch (err) {
      console.error('Reset error:', err);
      alert('Error: ' + (err.message || 'Unknown error'));
    }
  });
}

// ================================
// Screen switchers
// ================================
if (showRegisterBtn) {
  showRegisterBtn.addEventListener('click', () => {
    hide('loginScreen');
    show('registrationScreen');
  });
}

if (showLoginBtn) {
  showLoginBtn.addEventListener('click', () => {
    hide('registrationScreen');
    show('loginScreen');
  });
}

if (showResetBtn) {
  showResetBtn.addEventListener('click', () => {
    hide('loginScreen');
    show('resetScreen');
  });
}

if (showLoginFromResetBtn) {
  showLoginFromResetBtn.addEventListener('click', () => {
    hide('resetScreen');
    show('loginScreen');
  });
}

