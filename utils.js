/* utils.js — Shared utility functions across all pages */

/* ── Cookie consent check ── */
function canUseCookies() {
  return localStorage.getItem('cookieConsent') === 'accepted';
}

/* ── Session helpers ── */
function getCookie(name) {
  if (!canUseCookies()) return null;

  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
function setCookie(name, value, days) {
  if (!canUseCookies()) return; // 🚫 block cookies if not accepted

  days = days || 365 * 3;
  var expires = new Date(Date.now() + days * 864e5).toUTCString();

  document.cookie = name + '=' + encodeURIComponent(value) +
    '; expires=' + expires + '; path=/; SameSite=Lax';
}

function saveSession(userId, username) {
  /* Guard: never store undefined/null — it would break session checks */
  if (!userId || String(userId) === 'undefined' || String(userId) === 'null') {
    console.error('saveSession: invalid userId', userId);
    return;
  }
  localStorage.setItem('Userid', String(userId));
  localStorage.setItem('username', String(username || 'User'));

  // will only run if allowed
  setCookie('Userid', userId);
  setCookie('username', username);
}
function clearSession() {
  localStorage.removeItem('Userid');
  localStorage.removeItem('username');
  setCookie('Userid', '', -1);
  setCookie('username', '', -1);
}

function getSession() {
  var localUser = localStorage.getItem('Userid');
  var localName = localStorage.getItem('username');

  if (localUser) {
    return {
      userId: localUser,
      username: localName,
    };
  }

  // fallback to cookies ONLY if allowed
  if (canUseCookies()) {
    return {
      userId: getCookie('Userid'),
      username: getCookie('username'),
    };
  }

  return { userId: null, username: null };
}

function checkIfAlreadyLoggedIn() {
  var session = getSession();
  if (session.userId) {
    window.location.replace(CONFIG.ROUTES.MAIN);
  }
}

function requireLogin() {
  var session = getSession();
  if (!session.userId) {
    window.location.replace(CONFIG.ROUTES.LOGIN);
  }
  return session;
}

/* ── Validation ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── HTTP helper ── */
async function apiFetch(url, options) {
  options = options || {};
  try {
    var res = await fetch(url, {
      headers: Object.assign({ 'Content-Type': 'application/json' }, options.headers || {}),
      method: options.method || 'GET',
      body: options.body || undefined,
    });
    var data = await res.json().catch(function () { return {}; });
    return { ok: res.ok, status: res.status, data: data };
  } catch (err) {
    console.error('Network error:', err);
    return { ok: false, status: 0, data: { Report: 'Network error — check your connection.' } };
  }
}

/* ── Toast notifications ── */
function showToast(msg, type) {
  type = type || 'error';
  var toast = document.getElementById('__toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = '__toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast toast--' + type + ' toast--show';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.classList.remove('toast--show');
  }, 3500);
}

/* ── Button loading state ── */
function setLoading(btn, loading) {
  btn.disabled = loading;
  if (!btn.dataset.originalText) btn.dataset.originalText = btn.textContent.trim();
  if (loading) {
    // Insert spinner + text
    btn.innerHTML = '<span class="spinner"></span> Please wait…';
  } else {
    btn.textContent = btn.dataset.originalText;
  }
}

/* ── Modal helpers ── */
function openModal(id) {
  var overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('open');
    // Trap focus on first focusable element
    setTimeout(function () {
      var focusable = overlay.querySelector('input, button');
      if (focusable) focusable.focus();
    }, 150);
  }
}

function closeModal(id) {
  var overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

/* Close modal on backdrop click */
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

/* Close modal on Escape key */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function (el) {
      el.classList.remove('open');
    });
  }
});

/* ── Clipboard helper ── */
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('copied');
    }, 2000);
  } catch {
    showToast('Could not copy — please copy manually.', 'error');
  }
}
(function enforceCookiePolicy() {
  const consent = localStorage.getItem('cookieConsent');

  if (consent === 'rejected') {
    document.cookie = 'Userid=; Max-Age=0; path=/';
    document.cookie = 'username=; Max-Age=0; path=/';
  }
})();