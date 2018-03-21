const bcrypt = require('bcrypt');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function query(q, values = []) {
  const client = new Client({
     user: 'postgres',
     host: 'localhost',
     database: 'hinriksteinar',
     password: 'postgres',
   });
 await client.connect();

  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }

  return result;
}

async function comparePasswords(passwd, hash) {
  const result = await bcrypt.compare(passwd, hash);

  return result;
}

async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  const result = await query(q, [username]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function createUser(username, passwd, name, imgName) {
  const hashedPassword = await bcrypt.hash(passwd, 11);

  const q = 'INSERT INTO users (username, passwd, name, imgName) VALUES ($1, $2, $3, $4) RETURNING *';

  const result = await query(q, [username, hashedPassword, name, imgName]);

  return result.rows[0];
}

module.exports = {
  comparePasswords,
  findByUsername,
  findById,
  createUser,
}
