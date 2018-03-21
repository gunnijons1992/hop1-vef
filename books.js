const { Client } = require('pg')

const connectionString = 'postgres://postgres:@localhost/hinriksteinar';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'hinriksteinar',
  password: 'postgres',
});

client.connect();



/*async function readAll() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM books [ ORDER BY bookId ] [ LIMIT { 10 } ] [ OFFSET 0 ]');

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting data');
    throw err;
  } finally {
    await client.end();
  }
}
*/
