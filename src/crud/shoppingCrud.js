const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const PRIORITY_ORDER_SQL = `
  CASE priority
    WHEN 'HIGH' THEN 1
    WHEN 'MEDIUM' THEN 2
    WHEN 'LOW' THEN 3
    ELSE 4
  END
`;

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    item_name: row.item_name,
    priority: row.priority,
    purchased: Boolean(row.purchased),
    updated_at: row.updated_at,
  };
}

function createShoppingCrud(db) {
  const selectAllStmt = db.prepare(`
    SELECT id, item_name, priority, purchased, updated_at
    FROM shopping_items
    ORDER BY ${PRIORITY_ORDER_SQL} ASC, id ASC
  `);

  const selectByPriorityStmt = db.prepare(`
    SELECT id, item_name, priority, purchased, updated_at
    FROM shopping_items
    WHERE priority = ?
    ORDER BY ${PRIORITY_ORDER_SQL} ASC, id ASC
  `);

  const selectByIdStmt = db.prepare(`
    SELECT id, item_name, priority, purchased, updated_at
    FROM shopping_items
    WHERE id = ?
  `);

  const insertStmt = db.prepare(`
    INSERT INTO shopping_items (item_name, priority, purchased, updated_at)
    VALUES (?, ?, ?, ?)
  `);

  const updatePurchasedStmt = db.prepare(`
    UPDATE shopping_items
    SET purchased = ?, updated_at = ?
    WHERE id = ?
  `);

  const deleteByIdStmt = db.prepare(`
    DELETE FROM shopping_items
    WHERE id = ?
  `);

  function getAllItems(filters = {}) {
    const rows = filters.priority
      ? selectByPriorityStmt.all(filters.priority)
      : selectAllStmt.all();
    return rows.map(mapRow);
  }

  function getItemById(id) {
    return mapRow(selectByIdStmt.get(id));
  }

  function createItem({ item_name, priority = 'MEDIUM', purchased = false }) {
    const now = new Date().toISOString();
    const result = insertStmt.run(item_name.trim(), priority, purchased ? 1 : 0, now);
    return getItemById(Number(result.lastInsertRowid));
  }

  function toggleItemPurchased(id, explicitPurchased) {
    const existing = getItemById(id);
    if (!existing) return null;

    const nextPurchased =
      typeof explicitPurchased === 'boolean' ? explicitPurchased : !existing.purchased;
    const now = new Date().toISOString();

    updatePurchasedStmt.run(nextPurchased ? 1 : 0, now, id);
    return getItemById(id);
  }

  function deleteItem(id) {
    const existing = getItemById(id);
    if (!existing) return null;

    deleteByIdStmt.run(id);
    return existing;
  }

  return {
    getAllItems,
    getItemById,
    createItem,
    toggleItemPurchased,
    deleteItem,
  };
}

module.exports = {
  VALID_PRIORITIES,
  createShoppingCrud,
};
