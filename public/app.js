const swDot = document.getElementById('swDot');
const swStatus = document.getElementById('swStatus');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        if (swDot) swDot.classList.add('online');
        if (swStatus) swStatus.textContent = 'Service Worker: активен (офлайн готов)';
      })
      .catch((err) => {
        if (swDot) swDot.classList.add('offline');
        if (swStatus) swStatus.textContent = `Service Worker: ошибка (${err.message})`;
      });
  });
} else if (swStatus) {
  swStatus.textContent = 'Service Worker не поддерживается браузером';
}

const netDot = document.getElementById('netDot');
const netStatus = document.getElementById('netStatus');

function updateNetworkStatus() {
  if (!netDot || !netStatus) return;
  if (navigator.onLine) {
    netDot.classList.remove('offline');
    netDot.classList.add('online');
    netStatus.textContent = 'Сеть: онлайн';
  } else {
    netDot.classList.remove('online');
    netDot.classList.add('offline');
    netStatus.textContent = 'Сеть: офлайн (работает кеш PWA)';
  }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (installBtn) {
    installBtn.classList.remove('hidden');
  }
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.classList.add('hidden');
  });
}

const countInput = document.getElementById('countInput');
const generateBtn = document.getElementById('generateBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const uuidList = document.getElementById('uuidList');
const rawJson = document.getElementById('rawJson');
const feedback = document.getElementById('feedback');

let currentUuids = [];

function showMessage(text, type = 'info') {
  if (!feedback) return;
  feedback.textContent = text;
  feedback.className = `message show ${type}`;
}

function clearMessage() {
  if (!feedback) return;
  feedback.className = 'message';
  feedback.textContent = '';
}

function renderUuids(uuids) {
  if (!uuidList) return;
  currentUuids = uuids;
  uuidList.innerHTML = '';

  uuids.forEach((id) => {
    const li = document.createElement('li');
    li.className = 'uuid-item';

    const span = document.createElement('span');
    span.textContent = id;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'secondary';
    btn.textContent = 'Копировать';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(id);
        btn.textContent = 'Скопировано';
        setTimeout(() => {
          btn.textContent = 'Копировать';
        }, 1200);
      } catch {
        showMessage('Не удалось скопировать в буфер обмена', 'error');
      }
    });

    li.appendChild(span);
    li.appendChild(btn);
    uuidList.appendChild(li);
  });
}

function generateLocalFallback(count) {
  const safeCount = Math.min(Math.max(Number(count) || 1, 1), 10);
  const uuids = [];
  for (let i = 0; i < safeCount; i += 1) {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      uuids.push(window.crypto.randomUUID());
    } else {
      uuids.push('offline-uuid-' + Math.random().toString(16).slice(2));
    }
  }
  return { count: safeCount, uuids, source: 'local-offline-fallback' };
}

async function fetchEndpoint(url, updateList = false) {
  clearMessage();
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (rawJson) {
      rawJson.textContent = `HTTP ${response.status} — ${url}\n\n${JSON.stringify(data, null, 2)}`;
    }

    if (!response.ok) {
      if (data.offline && updateList) {
        const local = generateLocalFallback(countInput ? countInput.value : 1);
        renderUuids(local.uuids);
        showMessage('Сервер недоступен (офлайн). UUID сгенерированы локально в браузере.', 'info');
        return;
      }
      showMessage(`Ошибка ${response.status}: ${data.error || 'Некорректный запрос'}`, 'error');
      return;
    }

    if (updateList && Array.isArray(data.uuids)) {
      renderUuids(data.uuids);
    }
  } catch (err) {
    if (updateList) {
      const local = generateLocalFallback(countInput ? countInput.value : 1);
      renderUuids(local.uuids);
      showMessage('Вы в офлайн-режиме. UUID сгенерированы локально в браузере.', 'info');
    } else {
      showMessage(`Не удалось выполнить запрос: ${err.message}`, 'error');
    }
  }
}

if (generateBtn && countInput) {
  generateBtn.addEventListener('click', () => {
    const countValue = countInput.value.trim();
    const url = countValue === '' ? '/api/uuid' : `/api/uuid?count=${encodeURIComponent(countValue)}`;
    fetchEndpoint(url, true);
  });

  fetchEndpoint(`/api/uuid?count=${encodeURIComponent(countInput.value)}`, true);
}

if (copyAllBtn) {
  copyAllBtn.addEventListener('click', async () => {
    if (!currentUuids.length) {
      showMessage('Сначала сгенерируйте хотя бы один UUID', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(currentUuids.join('\n'));
      showMessage(`Скопировано UUID: ${currentUuids.length}`, 'info');
    } catch {
      showMessage('Не удалось скопировать список в буфер обмена', 'error');
    }
  });
}

document.querySelectorAll('.quick-tests button[data-url]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const url = btn.getAttribute('data-url');
    fetchEndpoint(url, url.startsWith('/api/uuid'));
  });
});
