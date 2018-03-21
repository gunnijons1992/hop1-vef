const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/hinriksteinar';


async function readAll() {
  const client = new Client({
     user: 'postgres',
     host: 'localhost',
     database: 'hinriksteinar',
     password: 'postgres',
   });
 await client.connect();

  try {
    const result = await client.query('SELECT * FROM books ORDER BY id LIMIT 10 OFFSET 0');

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function readCategories() {
  const client = new Client({
     user: 'postgres',
     host: 'localhost',
     database: 'hinriksteinar',
     password: 'postgres',
   });
 await client.connect();

  try {
    const result = await client.query('SELECT * FROM categories');

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function readCategories() {
  const client = new Client({
     user: 'postgres',
     host: 'localhost',
     database: 'hinriksteinar',
     password: 'postgres',
   });
 await client.connect();

  try {
    const result = await client.query('SELECT * FROM categories');

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function readOne(id) {
  const client = new Client({
     user: 'postgres',
     host: 'localhost',
     database: 'hinriksteinar',
     password: 'postgres',
   });
 await client.connect();

  try {
    const result = await client.query('SELECT * FROM books WHERE id = ' + id);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting data');
    throw err;
  } finally {
    await client.end();
  }
}






module.exports = {
  //create,
  readAll,
  readCategories,
  readOne,
  //del,
};
