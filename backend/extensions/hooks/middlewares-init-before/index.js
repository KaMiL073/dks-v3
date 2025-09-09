module.exports = function registerHook({ init }) {
  const basePath = '/backend';
  const basePathLength = basePath.length;

  init('middlewares.before', async ({ app }) => {
    app.use((req, res, next) => {
      req.originalUrl = req.originalUrl.slice(basePathLength);
      req.url = req.url.slice(basePathLength);
      if (req.path === null) {
        return res.redirect(301, `${basePath}/`);
      }

      return next();
    });
  });
};
