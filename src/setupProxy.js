const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    [
      '/auth',
      '/appointments',
      '/books',
      '/emotion-logs',
      '/emotions',
      '/events',
      '/feelings-diaries',
      '/food-diaries',
      '/personal-diaries',
      '/sanctum',
      '/schedules',
      '/support-phones',
      '/user',
      '/storage',
      '/emotion_icons',
      '/avatars'
    ],
    createProxyMiddleware({
      target: 'https://ababkova.xn--80ahdri7a.site',
      changeOrigin: true,
      secure: false
    })
  );
};
