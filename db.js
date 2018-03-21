const { Client } = require('pg');

const Converter = require("csvtojson").Converter;

const converter = new Converter({});


const connectionString = 'postgres://postgres:@localhost/hinriksteinar';



 converter.fromFile("./data/books.csv",async function(err,result){
    // if an error has occured then handle it
    if(err){
        console.log("An Error Has Occured");
        console.log(err);
    }
    // create a variable called json and store
    // the result of the conversion

    const json = result;

      async function createCategories (json){


       const client = new Client({
          user: 'postgres',
          host: 'localhost',
          database: 'hinriksteinar',
          password: 'postgres',
        });
      await client.connect();

      const query = 'INSERT into categories (category) SELECT CAST($1 AS VARCHAR) WHERE NOT EXISTS (SELECT category FROM categories WHERE category=$1)';
      for (let i = 0; i < json.length; i++) {
        let values = [json[i].category];
        try {
          await client.query(query, values);
        } catch (err) {
          console.error('Error inserting data');
          throw err;
        }
      }
      await client.end();
    }


    async function createBooks (json){

     const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'hinriksteinar',
        password: 'postgres',
      });
    await client.connect();

    const query = 'INSERT into books (title, isbn13, author, description, category) VALUES($1, $2, $3, $4, $5)';
    for (let i = 0; i < json.length; i++) {
      let values = [json[i].title, json[i].isbn13, json[i].author, json[i].description, json[i].category];
      try {
        await client.query(query, values);
      } catch (err) {
        console.error('Error inserting data');
        throw err;
      }
    }
    await client.end();
  }


createCategories(json);
createBooks(json);
    // log our json to verify it has worked
});
