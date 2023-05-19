// app.METHOD(PATH, HANDLER);
// METHOD: GET, POST, PUT, PATCH, DELETE.
// PATH: шлях на сервері ('/').
// HANDLER: функція, що виконується при збігу маршруту

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/contact', (req, res) => {
  res.send('<h1>Contact page</h1>');
});

// Проміжне ПЗ
app.use((req, res, next) => {
  console.log('Наше проміжне ПЗ');
  next();
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

// ^ Символи в шляху: ?, +, *
// app.get('/con?tact', (req, res) => {})
// Символ ?: попередній символ може зустрічатися 1 раз або відсутній (cotact або contact).
// app.get('/con+tact', (req, res) => {})
// Символ +: попередній символ може зустрічатися 1 і більше разів. (contact, conntact, connntact і т.і.)
// app.get('/con*tact', (req, res) => {})
// Символ *: вказує, що на місці цього символу може бути будь-яка кількість символів (contact, conxtact, con123tact і т.і.)
