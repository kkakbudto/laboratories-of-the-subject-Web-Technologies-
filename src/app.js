const path = require('node:path');
const express = require('express');
const { createShoppingCrud } = require('./crud/shoppingCrud');
const { createShoppingRouter } = require('./routes/shoppingRoutes');

function createApp(db) {
  const app = express();
  const crud = createShoppingCrud(db);

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/shopping', createShoppingRouter(crud));

  app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ error: 'Некорректный формат JSON в теле запроса' });
    }
    return next(err);
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  });

  return app;
}

module.exports = {
  createApp,
};
