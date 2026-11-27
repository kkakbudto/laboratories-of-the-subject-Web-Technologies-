const express = require('express');
const { VALID_PRIORITIES } = require('../crud/shoppingCrud');

function parseId(rawId) {
  if (!/^\d+$/.test(rawId)) return null;
  const id = Number(rawId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function createShoppingRouter(crud) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const { priority } = req.query;

    if (priority !== undefined) {
      if (typeof priority !== 'string' || !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          error: `Неизвестный приоритет "${priority}". Допустимые значения: ${VALID_PRIORITIES.join(', ')}`,
        });
      }
    }

    const items = crud.getAllItems({ priority });
    return res.json(items);
  });

  router.get('/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Некорректный ID записи' });
    }

    const item = crud.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    return res.json(item);
  });

  router.post('/', (req, res) => {
    const { item_name, priority, purchased } = req.body || {};

    if (typeof item_name !== 'string' || item_name.trim().length === 0) {
      return res.status(400).json({
        error: 'Поле item_name обязательно и не должно быть пустым',
      });
    }

    const resolvedPriority = priority === undefined ? 'MEDIUM' : priority;
    if (typeof resolvedPriority !== 'string' || !VALID_PRIORITIES.includes(resolvedPriority)) {
      return res.status(400).json({
        error: `Неизвестный приоритет "${priority}". Допустимые значения: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    if (purchased !== undefined && typeof purchased !== 'boolean') {
      return res.status(400).json({
        error: 'Поле purchased должно иметь логический тип (boolean)',
      });
    }

    const created = crud.createItem({
      item_name,
      priority: resolvedPriority,
      purchased: purchased ?? false,
    });

    return res.status(201).json(created);
  });

  router.patch('/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Некорректный ID записи' });
    }

    const hasExplicitPurchased =
      req.body && Object.prototype.hasOwnProperty.call(req.body, 'purchased');

    if (hasExplicitPurchased && typeof req.body.purchased !== 'boolean') {
      return res.status(400).json({
        error: 'Поле purchased должно иметь логический тип (boolean)',
      });
    }

    const updated = crud.toggleItemPurchased(
      id,
      hasExplicitPurchased ? req.body.purchased : undefined
    );

    if (!updated) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    return res.json(updated);
  });

  router.delete('/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Некорректный ID записи' });
    }

    const deleted = crud.deleteItem(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    return res.json({ message: 'Покупка удалена', item: deleted });
  });

  return router;
}

module.exports = {
  createShoppingRouter,
};
