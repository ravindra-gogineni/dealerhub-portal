const Datastore = require('nedb-promises');
const path = require('path');

const dbPath = (name) => path.join(__dirname, 'data', `${name}.db`);

const db = {
  inventory: Datastore.create({ filename: dbPath('inventory'), autoload: true }),
  leads: Datastore.create({ filename: dbPath('leads'), autoload: true }),
  appointments: Datastore.create({ filename: dbPath('appointments'), autoload: true }),
  parts: Datastore.create({ filename: dbPath('parts'), autoload: true }),
  users: Datastore.create({ filename: dbPath('users'), autoload: true })
};

module.exports = db;
