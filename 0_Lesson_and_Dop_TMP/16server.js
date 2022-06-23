// Node.js #16 Добавление и получение данных (Get & Post Requests)

//через сайт БД в нашей БД создаем новую коллекцию contacts. Внутри коллекции кликаем кнопку INSERT DOCUMENT. В появившемся окне мы можем добавить пару КЛЮЧ-ЗНАЧЕНИЕ. 1-я пара: name-YouTube, 2-я пара: link-http://youtube.com/YauhenKavalchuk. Справа есть оп-ции для выбора формата данных. В нашем случае - String (строка). Снова кликаем кнопку INSERT DOCUMENT и создаем еще 2 пары: name-Twitter и link-http://twitter.com/YauhenKavalchuk. После того, как мы добавили нужные данные в mongodb, для этих контактов нам нужно создать модель. Для єтого копируем модель файла постов, переименовываем его, удаляем лишние аргументы, удаляем timestamps (т.к. значения контактов не будем создавать в приложении, а будем брать готовые из БД) и вместо post прописываем contact. Поля переименовывем на name и link. (см.файл './models/contact')

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Post = require('./models/post');
const Contact = require('./models/contact'); //импортируем БД в файл сервера 

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;
const db = 'mongodb+srv://Oleh:pass321@cluster0.nnedg.mongodb.net/node-blog?retryWrites=true&w=majority';

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => console.log('Conected to DB'))
    .catch((error) => console.log(error));

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({ extended: false }));

app.use(express.static('styles'));

app.get('/', (req, res) => {
    const title = 'Home';
    res.render(createPath('index'), { title });
});

//обновим логику, чтобы все данные получать непосредственно из БД

app.get('/contacts', (req, res) => {
    const title = 'Contacts';
    Contact //обращаемся к модели 
        .find() // используем метод .find - он помогает найти и вернуть все значения, которые находятся в коллекции
        .then((contacts) => res.render(createPath('contacts'), { contacts, title })) //метод асинхронный, поэтому в .then можем отрендерить наш UI с полученными данными
        .catch((error) => { // в случае ошибки выведем ее в консоль и отрисуем страницу ошибки
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

// заключительный роут, который использует данные, хранящиеся на сервере это страница отдельного поста. Здесь из БД нужно возвращать отдельное значение. Копируем конструкцию из app.get('/posts'...

app.get('/posts/:id', (req, res) => {
    const title = 'Post';
    Post
        .findById(req.params.id) //здесь используем метод .findById, который по ID находит конкретное значение и возвращает его. ID будем брать из адресной строки браузера, получить его можно из запроса (из поля .params, которое хранит различные значения из адресной строки)
        .then((post) => res.render(createPath('post'), { post, title })) // после этого в метод .then возвращается один post, его мы отправляем в ответ, а в качестве страницы на UI используем файл-шаблон post
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

// с роутом posts (который предназначен для вывода всех новостей) сделаем теже изменения, как и с contacts и список новостей также будем получать из БД

app.get('/posts', (req, res) => {
    const title = 'Posts';
    Post
        .find()
        .sort({ createdAt: -1 }) //для отображения последних добавленных постов в самом верху добавим сортировку по убыванию по дате: добавили метод .sort, внутрь которого передали объект, в качестве ключа указываем поле, по которому бедт производиться сортировка (createdAt), а в качестве значения -1, т.е. сортировать по убыванию
        .then((posts) => res.render(createPath('posts'), { posts, title }))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

//после изменений в двух предыдущих роутах у нас в постах перестает отображаться дата поста. На сервере в mongodb для хранения дат есть 2 поля: createdAt (дата и время создания поста) и updateAt (дата и время редактирования поста). Для того чтобы отображалась дата создания поста необходимо внести изменения в файлы шаблонов: ./ejs-views/post.ejs и ./ejs-views/posts.ejs (см. в них)

app.post('/add-post', (req, res) => {
    const { title, author, text } = req.body;
    const post = new Post({ title, author, text });
    post
        .save()
        .then((result) => res.redirect('/posts')) //чтобы создать редирект на страницу со всеми новостями при создании новости, устанавливаем метод .redirect (логику редиректа), внутрь передаем страницу на которую должен произойти переход
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        })
});

app.get('/add-post', (req, res) => {
    const title = 'Add Post';
    res.render(createPath('add-post'), { title });
});

app.get('/about-us', (req, res) => {
    res.redirect('/contacts');
})

app.use((req, res) => {
    const title = 'Error Page';
    res
        .status(404)
        .render(createPath('error'), { title });
})