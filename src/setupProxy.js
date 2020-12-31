const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/forecast",
    createProxyMiddleware({
      target: "https://cors-anywhere.herokuapp.com/https://api.darksky.net",
      secure: false,
      changeOrigin: true,
    })
  );
};
