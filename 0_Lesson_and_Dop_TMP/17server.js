// Node.js #17 Удаление и редактирование данных (Delete & Update Requests)
//добавлены кнопки удаления и редактирования. Изменения внесены в файлы post.ejs, posts.ejs, head.ejs

// Полностью организовать удаление через сервер не возможно, т.к. с UI нужно передавать данные. Удаление, которое мы реализуем, основывается на ID элемента, поэтому нам нужно пробросить это поле из браузера (см. шаблон posts.ejs)
//После изменений в файле posts.ejs создаем здесь роут, который будет обрабатывать удаление
//также внесем изменения в файл post.ejs

//чтобы научить изменять данные, копируем файл add-post.ejs и переименовываем его в edit-post.ejs
// Подключаем модуль method-override:
// https://www.npmjs.com/package/method-override - Install, - устанавливаем модуль в проект, после чего перезапускаем сервер
// Examples - override using a query value (Примеры - переопределить, используя значение запроса)

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); //импортируем модуль method-override в файл сервера, т.к. это пакет является midlewar то его нужно подключить
const Post = require("./models/post");
const Contact = require("./models/contact");

const app = express();

app.set("view engine", "ejs");

const PORT = 3000;
const db =
  "mongodb+srv://Oleh:pass321@cluster0.nnedg.mongodb.net/node-blog?retryWrites=true&w=majority";

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("Conected to DB"))
  .catch((error) => console.log(error));

const createPath = (page) =>
  path.resolve(__dirname, "ejs-views", `${page}.ejs`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false }));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(express.static("styles"));

app.use(methodOverride("_method")); // т.к. это method-override является midlewar то его нужно подключить, испльзуя конструкцию app.use, внутрь которой передаем данный модуль со строкой, на которую он будет реагировать (тип такого подключения описан на странице документации: https://www.npmjs.com/package/method-override)

app.get("/", (req, res) => {
  const title = "Home";
  res.render(createPath("index"), { title });
});

app.get("/contacts", (req, res) => {
  const title = "Contacts";
  Contact.find()
    .then((contacts) => res.render(createPath("contacts"), { contacts, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
    });
});

app.get("/posts/:id", (req, res) => {
  const title = "Post";
  Post.findById(req.params.id)
    .then((post) => res.render(createPath("post"), { post, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
    });
});

//создаем здесь роут, который будет обрабатывать удаление, используя новый тип метода - delete

app.delete("/posts/:id", (req, res) => {
  //в callback функции мы снова обращаемся к модели Post
  const title = "Post";
  Post.findByIdAndDelete(req.params.id) //используем метод .findByIdAndDelete В качестве аргумента передаем ID, который мы отправляем из UI
    .then((result) => {
      res.sendStatus(200); // при успешном выполнении вернем 200-й статус
    })
    .catch((error) => {
      //а конструкцию catch можем скопировать из любого другого роута и тогда при наличии ошибки у нас будет отрисовываться страница с ошибкой.
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
    });
});

// добавим роут, который будет возвращать созданную страницу с фомой, внутри которой заполнены все данные

app.get("/edit/:id", (req, res) => {
  // используем метод .get, роут определяем как /edit/:id,
  const title = "Edit Post"; //внутри задаем title
  Post.findById(req.params.id)
    .then((post) => res.render(createPath("edit-post"), { post, title })) // логику возврата шаблона с данными остается точно такая же как и в роуте страницы одного поста, только вместо шаблона post мы используем шаблон edit-post
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
    });
}); // чтобы попадать на эту страницу нужно внести изменения в файле post.ejs (см. стр. 13-14)

// добавляем роут (логику), чтобы вносимые изменения обновляли существующий в БД пост

app.put("/edit/:id", (req, res) => {
  // создаем новый роут с методом .put
  const { title, author, text } = req.body; // данные о заголовке,авторе и текст поста мы будем получать из тела запроса
  const { id } = req.params;
  Post.findByIdAndUpdate(id, { title, author, text }) // у модели Post используя метод .findByIdAndUpdate мы не сохраняем новый, а обновляем существующий пост. Данный метод ищет в БД элемент по номеру id, после чего обновляет его поля новыми полученными данными, поэтому в качестве аргумента он принимает id, который берем из параметров запроса, а в качестве второго аргумента идет объект с данными
    .then((result) => res.redirect(`/posts/${id}`)) // в случае успешного обновления нужно выполнить переход обратно на страницу постов
    .catch((error) => {
      console.log(error); //в случае ошибки отрисовываем соответствующую страницу
      res.render(createPath("error"), { title: "Error" });
    });
});

app.get("/posts", (req, res) => {
  const title = "Posts";
  Post.find()
    .sort({ createdAt: -1 })
    .then((posts) => res.render(createPath("posts"), { posts, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
    });
});

app.post("/add-post", (req, res) => {
  const { title, author, text } = req.body;
  const post = new Post({ title, author, text });
  post
    .save()
    .then((result) => res.redirect("/posts"))
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
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
