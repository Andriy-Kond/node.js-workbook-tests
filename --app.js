// app.METHOD(PATH, HANDLER);
// METHOD: GET, POST, PUT, PATCH, DELETE.
// PATH: шлях на сервері ('/').
// HANDLER: функція, що виконується при збігу маршруту

const express = require('express'); // підключення пакету express, що призначений для створення веб-серверу
const app = express(); // створення веб-серверу

// ^ Дозволяємо кросс-доменні запити, коли адреса сервера і адреса фрон-енда не збігаються.
const cors = require('cors');
const corsMiddleware = cors(); // під капотом йде маніпуляція із заголовками щоб дозволити працювати з різними доменними іменами на сервері і фронтенді
app.use(corsMiddleware);

// Зазвичай запис скорочюють до такого:
app.use(cors());

// В пакеті cors є додаткові налаштування, які дозволяють робити запит тільки з одного url:
var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.get('/products/:id', cors(corsOptions), function (req, res, next) {
  res.json({ msg: 'This is CORS-enabled for only example.com.' });
});
// або з переліку декількох адрес:
var whitelist = ['http://example1.com', 'http://example2.com'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// ^/ Дозволяємо кросс-доменні запити, коли адреса сервера і адреса фрон-енда не збігаються.

fs = require('fs/promises');

// Перший аргумент - назва маршруту, другим - колбек, що спрацьовує, коли маршрут знайдено
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// express передає у колбек два запити:
// req - об'єкт, в якому зберігається вся інформація запиту (тіло запиту, адреса, метод і ін.)
// res - об'єкт, який дозволяє налаштувати і відправити відповідь.
// Найпростіший спосіб відправити відповідь - використати метод send(). В ньому можна передати об'єкт, масив, рядок з html розміткою і ін. send() відправляє відповідь на frontend. Тому якщо записати два send(), то другий просто не спрацює і ми отримаємо помилку в консолі.
// ЯКщо потрібно взяти якусь інформацію із запиту, то звертаємось до req:
console.log('req.url :>> ', req.url); // /contacts
console.log('req.method :>> ', req.method); // GET

app.get('/contact', (req, res) => {
  res.send('<h1>Contact page</h1>');
});

// ^ Проміжне ПЗ
// Коли треба виконати певні дії незалежно від запиту чи відповіді, то використовують middleware.
// Викликають middleware за допомогою методу use(), який треба записати перед get-запитом:
app.use((req, res, next) => {
  console.log('Наше проміжне ПЗ');
  next();
});
// Першим аргументом use() можна передати якийсь маршрут, а другим колбек.
// Якщо у use() передати одразу лише колбек, то вона спрацює для будь-якого запиту.

// Коли приходить запит на певну адресу, то express перебирає кожен запис і перевіряє чи підходить він під цей запит.
// Якщо він знаходить запит, що підійшов (наприклад, збігся шлях "/books"), то далі він не йде, лише виконує колбек, що лежить у цьому записі.
// Тому запис use() без зазначення шляху буде виконуватись завжди, бо підходить під будь-який запит. А далі express не піде, бо така в нього логіка - виконав перший запит, що підходить і припиняє роботу. Тому для того, щоб запит пішов далі, третім аргументом у use() передається next(), який тре викликати в кінці, щоби express пішов далі.
// middleware-ів може буде декілька. Треба лише в кожному додавати next()

// Одна із задач middleware - це логування (в такий-то час прийшов такий-то запит на сервер за таким-то маршрутом):
const moment = require('moment');
app.use(async (req, res, next) => {
  // Записуємо метод, адресу і час. Метод і адресу беремо з запиту
  const { method, url } = req;
  // Час ми можемо створити за допомогою спеціального пакету moment (https://www.npmjs.com/package/moment або https://momentjs.com/)
  // Краще за date = new Date(), бо дозволяє правильно відформатувати дані.
  const date = moment().format('DD-MM-YYYY_hh:mm:ss');
  // Тепер ці дані треба записати у файл. Для цього підключаємо const fs = require('fs/promises');
  // Через те, що ми використовуємо проміс-версію fs маємо робити і всі функції асинхронними.
  // Проблема асинхронних функцій в тому, що вони повертають проміс. Але Ми в цих функціях (колбеки у use(), get(), etc.) нічого не повертаємо, ми відправляємо на фронтенд. Тому не важливо синхронна чи асинхронна функція - відправиться те, що ми написали, а не проміс. Тому можемо робити їх асинхронними без наслідків.

  await fs.appendFile('./public/server.log', `\n${method} ${url} ${date}`);
  // у файлі server.log отримаємо записи:
  // GET /books 16-02-2023_08:25:13
  // GET /products 16-02-2023_08:25:23
  next();
});

app.get('/products', async (req, res) => {
  res.json([]);
});

app.get('/books', async (req, res) => {
  res.json(books);
});

// Якщо адреса не вірна, то приходить помилка 404 і стандартна HTML-розмітка. А треба щоб був JSON. Для цього робимо так: в самому кінці перед listen() додаємо ще один use():
app.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

// Запуск веб-серверу. Перший аргумент listen - це назва локального серверу, другий - це функція, що спрацьовує, коли серверу успішно запущений:
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

// ^ Надсилання за допомогою форм
// Запит POST від форми стандартно має заголовок Content-Type: application/x-www-form-urlencoded
// Для отримання відправлених даних необхідно підключити парсер через проміжне ПЗ і він уже міститься у фреймворку.
// Для створення парсера даних від форм застосовується функція urlencoded():
app.use(express.urlencoded({ extended: false }));
// У цю функцію передається об'єкт, який визначає параметри парсингу.
// Значення extended: false вказує, що результат парсингу буде являти собою набір пар ключ-значення, а кожне значення може бути представлене у вигляді рядка чи масиву. Коли цей параметр дорівнює true, парсер використовує іншу бібліотеку для розбору формату рядка.

// Наприклад, маємо форму:
{
  /* <form action="/login" method="POST">
  <label for="email">Email</label>
  <input type="text" name="email" id="email" />
  <label for="password">Пароль</label>
  <input type="password" name="password" id="password" />
  <button type="submit">Увійти</button>
</form> */
}
// Відправляються дані (email та password) форми з адреси <url додатку>/login
// Ці дані ми повинні прийняти на стороні сервера наступним обробником:
app.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  // Виконуємо необхідні операції
});

// В результаті сервер має отримати дані в об'єкті req.body, наступного виду:
// {
//   email: 'Значення, що було введено в поле input',
//   password: 'Значення, що було введено в поле input'
// }

// ^ Передача JSON
// Парсер JSON у додатку підключається наступним чином:
app.use(express.json());
// Після того як парсер JSON буде підключено, наші обробники запитів можуть інтерпретувати значення req.body як об'єкт JavaScript замість рядка.
app.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  // Виконуємо необхідні операції
});
// Цей приклад припускає, що надіслано об'єкт JSON з властивостями email та password.
// Обов'язково: у запиту заголовок Content-Type повинен зберігати application/json, а ви повинні надіслати дійсну розмітку JSON.

// Наприклад, є JSON-файл і ми маємо його віддати у відповіді.
const books = require('./books'); // підключаємо JSON файл, що знаходиться у корні (books.js)
app.get('/books', (req, res) => {
  // щоб відправити масив, або об'єкт у форматі JSON достатньо просто передати його у send:
  res.send(books); // send автоматично сконвертує його у рядок у форматі JSON
  // Більш правильно використовувати не метод send, а метод json:
  res.json(books);
  // Метод json() краще, бо він вміє обробляти null від БД і поверне null. Метод send() не поверне нічого.
});

// Для перевірки GET-запиту достатньо JS (ввести адресний рядок і натиснути Enter)
// Для перевірки інших запитів тре використовувати Postman
