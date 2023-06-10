const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Connection URL
const url = 'mongodb+srv://cha:12345@cluster0.kwejkvz.mongodb.net/';

// Database Name
const dbName = 'myproject';

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/register', async (req, res) => {
  // Get the username and password from the request body
  let { username, password } = req.body;

  // TODO: Validate the username and password

  // Create a new MongoClient
  const client = new MongoClient(url);

  // Use connect method to connect to the Server
  await client.connect();
  const db = client.db(dbName);
  const usersCollection = db.collection('users');

  // Insert the new user into the database
  let result = await usersCollection.insertOne({ username, password });
  res.json({ success: true });

  client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
