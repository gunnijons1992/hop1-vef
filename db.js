const { Client } = require('pg')

const connectionString = 'postgres://postgres:@localhost/hinriksteinar';


const csvFilePath='./data/books.csv'
const csv=require('csvtojson')
let jsonBooks = null
csv()
.fromFile(csvFilePath)
.on('json', (jsonObj)=>{
    // combine csv header row and csv line to a json object
    // jsonObj.a ==> 1 or 4
    jsonBooks = jsonObj;
  })
.on('done',(error)=>{
      console.log(jsonBooks.title);
});


async function pushToDb(){

  const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'hinriksteinar',
  password: 'postgres',
  });

await client.connect();
 const query = 'INSERT into categories (category) VALUES ($1)';
 const values = [jsonBooks.category];

 try {
   await client.query(query, values);
 } catch (err) {
   console.error('Error inserting data');
   throw err;
 } finally {
   await client.end();
 }
}





client.query('SELECT * FROM books;', async (err, res) => {
  if (err) {
    console.error(err);
  } else {
    await console.log(res.rows);
  }

  client.end();
});
