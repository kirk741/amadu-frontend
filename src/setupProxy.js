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
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
      secure: false
    })
  );
};
