const crypto = require('crypto');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://cha:12345@cluster0.kwejkvz.mongodb.net/';
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect((err) => {
  const collection = client.db('<dbname>').collection('<collectionname>');
  // perform actions on the collection object
  const username = 'cha';
  const password = '12345';
  const user = { username: username, password: password };
  collection.findOne(user, function (err, res) {
    if (res) {
      console.log('User found');
    } else {
      console.log('User not found');
    }
    client.close();
  });
});

app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Hash the password with SHA-256 algorithm
  const hashedPassword = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');

  // Encrypt the hashed password with AES-256 algorithm
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encryptedPassword = cipher.update(hashedPassword, 'utf8', 'hex');
  encryptedPassword += cipher.final('hex');

  // Save the encrypted password to the database
  saveToDatabase(username, encryptedPassword);

  // Set a cookie named 'username' with the value of the username variable
  res.cookie('username', username);

  res.send('Login successful!');
});

function saveToDatabase(username, password) {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db('<dbname>').collection('<collectionname>');
    collection.insertOne(
      { username: username, password: password },
      function (err, res) {
        console.log('Inserted document');
        client.close();
      }
    );
  });
}

app.post('/logout', (req, res) => {
  // Clear the cookie named 'username'
  res.clearCookie('username');

  res.send('Logout successful!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
