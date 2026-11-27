const { initDatabase } = require('./db/database');
const { createApp } = require('./app');

const PORT = Number(process.env.PORT) || 8080;

const db = initDatabase();
const app = createApp(db);

const server = app.listen(PORT, () => {
  console.log(`Сервер «Список покупок» запущен: http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
