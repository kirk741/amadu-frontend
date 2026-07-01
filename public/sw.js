const CACHE_NAME = 'amadu-pwa-monolith-v1';

// ЖЕСТКИЙ ПРЕД-КЭШ: Чистая статика приложения
const ASSETS_TO_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/robots.txt',
  '/static/js/bundle.js',
  '/sounds/do.wav',
  '/sounds/do2.wav',
  '/sounds/re.wav',
  '/sounds/mi.wav',
  '/sounds/fa.wav',
  '/sounds/sol.wav',
  '/sounds/la.wav',
  '/sounds/si.wav',
  '/emotion_icons/happy.svg',
  '/emotion_icons/fine.svg',
  '/emotion_icons/ok.svg',
  '/emotion_icons/sad.svg',
  '/emotion_icons/angry.svg'
];

// 1. УСТАНОВКА
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_PRECACHE.map((url) => {
          return cache.add(url).catch((err) => console.warn(`[PWA] Не удалось пред-кэшировать: ${url}`, err));
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// 2. АКТИВАЦИЯ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); }));
    })
  );
  self.clients.claim();
});

// 3. ПЕРЕХВАТ ЗАПРОСОВ (С ЖЕСТКИМ РАЗДЕЛЕНИЕМ ДОМЕНОВ)
self.addEventListener('fetch', (event) => {
  const { method, url } = event.request;

  // ИГНОРИРУЕМ БЭКЕНД: Если запрос идет к домену ларавеля (ababkova...), воркер его НЕ кэширует как HTML!
  if (url.includes('ababkova.xn--80ahdri7a.site')) {
    // Для отправки данных (POST/PUT/PATCH/DELETE) в оффлайне пишем в IndexedDB
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      event.respondWith(
        fetch(event.request.clone()).catch(async () => {
          if ('sync' in self.registration) {
            await saveRequestToIndexedDB(event.request.clone());
            await self.registration.sync.register('sync-offline-requests');
            return new Response(JSON.stringify({
              success: true,
              message: "Сохранено локально в IndexedDB.",
              is_offline: true,
              data: { id: 'offline_' + Date.now(), created_at: new Date().toISOString() }
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ success: false, error: 'Сбой сети' }), { status: 503 });
        })
      );
    }
    return; // Выходим, не давая перекрыть GET-запросы бэка файлом index.html!
  }

  // СИСТЕМНЫЕ ВЕБ-СОКЕТЫ
  if (url.startsWith('ws://') || url.startsWith('wss://') || url.includes('/ws')) {
    return;
  }

  // ОБРАБОТКА СТАТИКИ ФРОНТЕНДА (GET)
  if (method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request.clone())
          .then((response) => {
            const isHttp = url.startsWith('http://') || url.startsWith('https://');
            if (response && response.status === 200 && isHttp) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
            }
            return response;
          })
          .catch(() => {
            if (url.match(/\.(png|jpg|jpeg|gif|svg|ico)$/i)) {
              return new Response('<svg xmlns="http://w3.org" width="1" height="1"/>', { headers: { 'Content-Type': 'image/svg+xml' } });
            }
            // Фолбэк на index.html только для домена самого ФРОНТЕНДА
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/index.html');
            }
          });
      })
    );
  }
});

// 4. ФОНОВАЯ СИНХРОНИЗАЦИЯ
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-requests') {
    event.waitUntil(sendOfflineRequestsToServer());
  }
});

// ==========================================
// 5. ПРИЕМ ПУШ-УВЕДОМЛЕНИЙ (СЛУШАТЕЛЬ ДЛЯ LARAVEL WEBPUSH)
// ==========================================
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Новое уведомление в Amadu',
      icon: '/logo192.png',
      badge: '/favicon.svg',
      data: { url: data.url || '/' }
    };
    event.waitUntil(self.registration.showNotification(data.title || 'Amadu', options));
  } catch (err) {
    console.error('Ошибка пуша:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const targetUrl = event.notification.data.url;
      for (const client of clientList) {
        if ('navigate' in client) {
          client.focus();
          return client.navigate(targetUrl);
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// СИСТЕМНЫЕ ФУНКЦИИ ИНДЕКСИРОВАНИЯ БАЗЫ ДАННЫХ
async function saveRequestToIndexedDB(request) {
  const db = await openIndexedDB();
  const bodyText = await request.text();
  const headersObj = {};
  for (const [key, value] of request.headers.entries()) { headersObj[key] = value; }
  return new Promise((resolve, reject) => {
    const tx = db.transaction('requests', 'readwrite');
    tx.objectStore('requests').add({ url: request.url, method: request.method, headers: JSON.stringify(headersObj), body: bodyText });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function sendOfflineRequestsToServer() {
  const db = await openIndexedDB();
  const tx = db.transaction('requests', 'readonly');
  const requests = await getAllItems(tx.objectStore('requests'));
  for (const req of requests) {
    try {
      const response = await fetch(req.url, { method: req.method, headers: JSON.parse(req.headers), body: req.body });
      if (response.ok) {
        const deleteTx = db.transaction('requests', 'readwrite');
        await deleteTx.objectStore('requests').delete(req.id);
      }
    } catch (error) { console.error('[PWA] Сбой синхронизации:', error); }
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AmaduOfflineDB', 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('requests', { keyPath: 'id', autoIncrement: true }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllItems(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
