// Вспомогательная функция для конвертации VAPID ключа
function urlBase64ToUint8Array(base64String) {
  if (!base64String) return new Uint8Array(0);
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ГЛАВНАЯ ФУНКЦИЯ ПОДПИСКИ НА ПУШИ
export const subscribeUserToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Пуш-уведомления не поддерживаются этим браузером.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // 1. Запрашиваем системное разрешение у пользователя (вылезет плашка браузера)
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Пользователь запретил показ уведомлений.');
      return;
    }

    // 2. Читаем публичный ключ из .env
    let publicVapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;

    // ЖЕСТКИЙ ФИКС: Если .env не прочитался в React, используем прямой ключ из консоли сервера хостинга!
    if (!publicVapidKey || publicVapidKey === "undefined" || publicVapidKey === "") {
      // ⚠️ СЮДА ВСУНЬ СВОЙ ДЛИННЫЙ ПУБЛИЧНЫЙ КЛЮЧ ИЗ .env СЕРВЕРА ХОСТИНГА (БЕЗ ПРОБЕЛОВ)
      publicVapidKey = "BM_твой_очень_длинный_публичный_ключ_который_начинается_обычно_на_B...";
    }
    // 3. Генерируем токен подписки внутри браузера
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    // 4. Отправляем полученную подписку на твой бэкенд Laravel
    const token = localStorage.getItem('token');

    const response = await fetch('https://ababkova.xn--80ahdri7a.site/push-subscriptions', {
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
