const db = require('./database');

function getNextInventoryNumber(sala_id = null) {
  const getNum = db.prepare('SELECT siguiente FROM numeracion WHERE sala_id IS ?');
  const insertNum = db.prepare('INSERT INTO numeracion (sala_id, siguiente) VALUES (?, ?)');
  const updateNum = db.prepare('UPDATE numeracion SET siguiente = ? WHERE sala_id IS ?');
  let row = getNum.get(sala_id);
  if (!row) {
    insertNum.run(sala_id, 2);
    return (sala_id ? `S${sala_id}-1` : `G-1`);
  } else {
    const current = row.siguiente;
    updateNum.run(current + 1, sala_id);
    return (sala_id ? `S${sala_id}-${current}` : `G-${current}`);
  }
}

module.exports = { getNextInventoryNumber };
