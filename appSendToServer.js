const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('example app listening port 3000!');
});

app.get('/contact', (req, res) => {
  res.send('<h1>It is contact page!</h1>');
});

// Middleware:
app.use((req, res, next) => {
  console.log('It is middleware');
  next();
});

// ^ Передача даних на сервер
// ~ 1. Через адресний рядок:
app.get('/contact/:id', (req, res) => {
  res.send(`<h1>Contact</h1> Параметр: ${req.params.id}`); // Параметр: 123
});
// За запитом http://localhost:3000/contact/123 req.params.id міститиме значення 123

// Приклад використання:
app.patch('/user/:userId', (req, res) => {
  const id = req.params.userId;
  // other code ...
});

// ~ 2. Через аргументи запиту після знаку питання:
// http://localhost:3000/contacts?skip=0&limit=10
// Результат буде знаходитись в об'єкті req.query:
// {
//   skip: 0,
//   limit: 10
// }
// Якщо запит без знаку питання (наприклад, /search), то req.query = {}

// ~ 3. Надсилання за допомогою форм:
// Запит POST від форми стандартно має заголовок:
// Content-Type: application/x-www-form-urlencoded.
// Насамперед для отримання відправлених даних необхідно підключити парсер через проміжне ПЗ і він уже міститься у фреймворку.
// Для створення парсера даних від форм застосовується функція urlencoded():
app.use(express.urlencoded({ extended: false }));

// приймаємо інформацію від форми аутентифікації:
{
  /* <form action="/login" method="POST">
  <label for="email">Email</label>
  <input type="text" name="email" id="email" />
  <label for="password">Пароль</label>
  <input type="password" name="password" id="password" />
  <button type="submit">Увійти</button>
</form>; */
}

// Браузер відправить на URL < урл нашого додатку > /login дані форми. Це будуть дві змінні: email та password. За це відповідають атрибути name у відповідних тегів input.
// Ці дані ми повинні прийняти на стороні сервера наступним обробником
app.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  // other code ...
});
// В результаті сервер має отримати дані в об'єкті req.body, наступного виду:
// {
//   email: 'Значення, що було введено в поле input',
//   password: 'Значення, що було введено в поле input'
// }

// ~ 4. Передача JSON:
// JSON формат - це основна форма передачі даних для Web-API.
// Парсер JSON у додатку підключається наступним чином:
app.use(express.json());
// Після того як парсер JSON буде підключено, наші обробники запитів можуть інтерпретувати значення req.body як об'єкт JavaScript замість рядка
app.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  // other code ...
});
// Важливо: у запиту заголовок Content-Type повинен зберігати application/json, а ви повинні надіслати дійсну розмітку JSON.
