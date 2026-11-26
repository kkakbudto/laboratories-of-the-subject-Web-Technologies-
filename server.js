const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    app: 'UUID Generator PWA',
    variant: 17,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

function parseUuidCount(rawCount) {
  if (rawCount === undefined) {
    return { valid: true, count: 1 };
  }

  if (typeof rawCount !== 'string' || !/^-?\d+$/.test(rawCount.trim())) {
    return { valid: false, error: 'Параметр count должен быть целым числом от 1 до 10' };
  }

  const count = Number(rawCount.trim());
  if (!Number.isInteger(count) || count < 1 || count > 10) {
    return { valid: false, error: 'Параметр count вне допустимого диапазона (от 1 до 10)' };
  }

  return { valid: true, count };
}

app.get('/api/uuid', (req, res) => {
  const parsed = parseUuidCount(req.query.count);

  if (!parsed.valid) {
    return res.status(400).json({ error: parsed.error });
  }

  const uuids = [];
  for (let i = 0; i < parsed.count; i += 1) {
    uuids.push(crypto.randomUUID());
  }

  return res.json({
    count: parsed.count,
    uuids,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
  });
}

module.exports = { app, parseUuidCount };