// Node.js #15 Интеграция БД в приложение (MongoDB Integration)
// Настройка БД mongodb - видео 00:00 - 05:55
// сайт - mongodb.com, вход через Google akaunt - oleh.kolesnyk.dnepr@gmail.com
// name DataBase - node-blog, password - pass321

const express = require("express");
const path = require("path");
const morgan = require("morgan");
// в терминале вводим команду: npm i mongoose
const mongoose = require("mongoose"); // после установки импортируем mongoose в наш сервер
const Post = require("./models/post"); //импортируем только что созданую модель

const app = express();

app.set("view engine", "ejs");

const PORT = 3000;
const db =
  "mongodb+srv://Oleh:pass321@cluster0.nnedg.mongodb.net/node-blog?retryWrites=true&w=majority"; // создали константу db, которой присвоили строку подключения, не забыв изменить в ней пароль (pass321) и имя БД (node-blog)

mongoose //устанавливаем подключение к БД
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true }) // в метод передаем константу db, и еще два дополнительных аргумента
  .then((res) => console.log("Conected to DB")) // поскольку это асинхронная операция можем воспользоваться методами .then и .catch. Здесь мы выведем в консоль строку о том, что успешно подключились к БД
  .catch((error) => console.log(error)); // выведем в консоль если появится ошибка. Псоле этого останавливаем и перезапускаем сервер.

const createPath = (page) =>
  path.resolve(__dirname, "ejs-views", `${page}.ejs`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(express.urlencoded({ extended: false }));

app.use(express.static("styles"));

app.get("/", (req, res) => {
  const title = "Home";
  res.render(createPath("index"), { title });
});

app.get("/contacts", (req, res) => {
  const title = "Contacts";
  const contacts = [
    { name: "YouTube", link: "http://youtube.com/YauhenKavalchuk" },
    { name: "Twitter", link: "http://twitter.com/YauhenKavalchuk" },
    { name: "GitHub", link: "http://github.com/YauhenKavalchuk" },
  ];
  res.render(createPath("contacts"), { contacts, title });
});

app.get("/posts/:id", (req, res) => {
  const title = "Post";
  const post = {
    id: "1",
    text: "You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out.",
    title: "Post title",
    date: "12/02/2022",
    author: "Nemo",
  };
  res.render(createPath("post"), { title, post });
});

app.get("/posts", (req, res) => {
  const title = "Posts";
  const posts = [
    {
      id: "1",
      text: "You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out.",
      title: "Post title",
      date: "12/02/2022",
      author: "Nemo", //
    },
  ];
  res.render(createPath("posts"), { title, posts });
});

//изменяем логику добавления поста

app.post("/add-post", (req, res) => {
  const { title, author, text } = req.body; //оставляем только деструктуризацию данных из запроса
  const post = new Post({ title, author, text }); //используя модель post собираем новый объект Post. Внутрь конструктора передаем получаемые из запроса данные
  post
    .save() // после чего используем метод .save. Он также является асинхронным, поэтому мы можем обработать приходящий результат
    .then((result) => res.send(result)) //в этом методе, используя res.send, отправляем данные на UI, т.е. если все удачно сохранится, то сохраненные данные мы увидим в браузере.
    .catch((error) => {
      // здесь перехватим ошибку
      console.log(error);
      res.render(createPath("error"), { title: "Error" }); //и дополнительно сделаем редирект на страницу ошибки
    });
});

app.get("/add-post", (req, res) => {
  const title = "Add Post";
  res.render(createPath("add-post"), { title });
});

app.get("/about-us", (req, res) => {
  res.redirect("/contacts");
});

app.use((req, res) => {
  const title = "Error Page";
  res.status(404).render(createPath("error"), { title });
});
