const { initDatabase } = require('./database');
const { createShoppingCrud } = require('../crud/shoppingCrud');

const SAMPLE_ITEMS = [
  { item_name: 'Молоко', priority: 'HIGH', purchased: false },
  { item_name: 'Хлеб', priority: 'HIGH', purchased: false },
  { item_name: 'Яйца', priority: 'HIGH', purchased: true },
  { item_name: 'Лекарства от простуды', priority: 'HIGH', purchased: false },
  { item_name: 'Куриное филе', priority: 'HIGH', purchased: false },
  { item_name: 'Сыр', priority: 'MEDIUM', purchased: false },
  { item_name: 'Макароны', priority: 'MEDIUM', purchased: true },
  { item_name: 'Яблоки', priority: 'MEDIUM', purchased: false },
  { item_name: 'Кофе в зёрнах', priority: 'MEDIUM', purchased: false },
  { item_name: 'Оливковое масло', priority: 'MEDIUM', purchased: true },
  { item_name: 'Сливочное масло', priority: 'MEDIUM', purchased: false },
  { item_name: 'Салфетки бумажные', priority: 'LOW', purchased: false },
  { item_name: 'Тёмный шоколад', priority: 'LOW', purchased: true },
  { item_name: 'Батарейки AA', priority: 'LOW', purchased: false },
  { item_name: 'Свечи ароматические', priority: 'LOW', purchased: false },
];

function runSeed() {
  const shouldReset = process.argv.includes('--reset');
  const db = initDatabase();
  const crud = createShoppingCrud(db);

  try {
    const existing = crud.getAllItems();
    if (existing.length > 0 && !shouldReset) {
      console.log(`В базе уже есть записей: ${existing.length}. Для перезаписи запустите с флагом --reset.`);
      return;
    }

    if (shouldReset) {
      db.exec('DELETE FROM shopping_items');
    }

    for (const item of SAMPLE_ITEMS) {
      crud.createItem(item);
    }

    const total = crud.getAllItems().length;
    console.log(`Добавлено примеров покупок: ${SAMPLE_ITEMS.length}. Всего записей в БД: ${total}.`);
  } finally {
    db.close();
  }
}

if (require.main === module) {
  runSeed();
}

module.exports = {
  SAMPLE_ITEMS,
  runSeed,
};
