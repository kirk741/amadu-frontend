// АБСОЛЮТНО НЕУБИВАЕМАЯ ФУНКЦИЯ ДЕКОДИРОВАНИЯ БЕЗ ИСПОЛЬЗОВАНИЯ ATOB
function urlBase64ToUint8Array(base64String) {
  if (!base64String) return new Uint8Array(0);

  // Вычищаем любые пробелы, кавычки и переносы
  const padding = base64String.replace(/["']/g, '').trim();

  // Приводим URL-safe Base64 к стандартному виду
  const base64 = padding.replace(/\-/g, '+').replace(/_/g, '/');

  // Таблица символов Base64 для ручного декодирования
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  let bufferLength = base64.length * 0.75;
  if (base64[base64.length - 1] === '=') {
    bufferLength--;
    if (base64[base64.length - 2] === '=') bufferLength--;
  }

  const bytes = new Uint8Array(bufferLength);
  let p = 0;

  for (let i = 0; i < base64.length; i += 4) {
    const base64Eq1 = lookup[base64.charCodeAt(i)];
    const base64Eq2 = lookup[base64.charCodeAt(i + 1)];
    const base64Eq3 = lookup[base64.charCodeAt(i + 2)];
    const base64Eq4 = lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (base64Eq1 << 2) | (base64Eq2 >> 4);
    if (p < bufferLength) bytes[p++] = ((base64Eq2 & 15) << 4) | (base64Eq3 >> 2);
    if (p < bufferLength) bytes[p++] = ((base64Eq3 & 3) << 6) | (base64Eq4 & 63);
  }

  return bytes;
}

// ГЛАВНАЯ ФУНКЦИЯ ПОДПИСКИ НА ПУШИ
export const subscribeUserToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Пуш-уведомления не поддерживаются этим браузером.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Пользователь запретил показ уведомлений.');
      return;
    }

    let publicVapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;

    if (!publicVapidKey || publicVapidKey === "undefined" || publicVapidKey === "") {
      // НА ВСЯКИЙ СЛУЧАЙ: Проверь, чтобы тут стоял твой точный ключ из консоли бэка
      publicVapidKey = "BEiIN0GXkcc50iEWa7PrYCRxLIBpySV9hedHF5KW6hoPCM7_YPYVCzftQy3UOhgGUQMt4BJFGy6K5aicxMbddKs";
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    const token = localStorage.getItem('token');

    const response = await fetch('https://xn--80ahdri7a.site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subscription)
    });

    const result = await response.json();
    if (result.success) {
      console.log('Девайс успешно зарегистрирован в базе пушей Laravel!');
    }

  } catch (error) {
    console.error('Ошибка при оформлении пуш-подписки:', error);
  }
};
