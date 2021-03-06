// Node.js #11 Node.js & Express (Node.js & Express)
// устанавливаем путь запуска в packed.json:
//   "scripts": {
//     "dev": "nodemon 10server.js"
// },
// командой npm run dev запускаем прослушивание

// создаем сервер:

const express = require("express"); // подключаем модуль Express
const path = require("path");

const app = express(); // сздаем константу app, в которую присваиваем вызов express

const PORT = 3000; // определяем константу для порта

const createPath = (page) => path.resolve(__dirname, "views", `${page}.html`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
}); // и запускаем прослушивание с помощью метода .listen. 'localhost' можно было оставить, но уберем, т.к. он явно определится

// Теперь у нас есть сервер, в который интегрирован express и он прослушивает запросы на 3000-м порту

// приступаем к передаче данных
// чтобы отправить данные из сервера в браузер используем метод .get, который вызываем непосредственно в созданном app

// app.get('/', (req, res) => {
//     res.send('<h1>Hello world!</h1>'); // внутри используется один метод: res.send. В него передаются данные, которые нужно отправить в браузер. В express не нужно передавать тип данных 'Conten-type'. Он сам определяет тип и передает их в браузер.
// });
// методы в express принимают 2 основных параметра: rout - путь по котрому идет обращение и callback-функция, которая будет вызываться. У неё также есть два основных параметра - это объекты запроса и ответа

// Теперь можем перейти к созданию полноценного роутинга
// для начала подключаем вверху модуль path и создаем функцию createPath, которые понадобятся для создания пути до файла, после чего обновляем логику метода .get (метод .send предназначенный для отправки данных заменяем на метод .sendFile, предназначенный для отправки файлов и внутрь передаем функцию createPath с именем домашней страницы и она принимает следующий вид:)

app.get("/", (req, res) => {
  res.sendFile(createPath("index"));
});

// также делаем для контактов

app.get("/contacts", (req, res) => {
  res.sendFile(createPath("contacts"));
});

// реализуем redirect

app.get("/about-us", (req, res) => {
  res.redirect("/contacts"); // используя redirect переходим на /contacts
});

// теперь обработка ошибок
// для этого есть файл error.html. На этот раз вместо метода .get мы вопользуемся методом .use. На этот раз путь передавать не нужно

app.use((req, res) => {
  res
    .status(404) // воспользовались встроенным методом .status для
    .sendFile(createPath("error"));
});

// на самом деле сейчасбыл создан не отдельный роут, а мидл вар, который будет перехватывать запросы по несуществующим путям и рендорить ошибку
