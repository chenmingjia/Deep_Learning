const admin = require('./controller/admin');

module.exports = app => {
  const { router } = app;
  router.get('/admin', admin.admin);
};