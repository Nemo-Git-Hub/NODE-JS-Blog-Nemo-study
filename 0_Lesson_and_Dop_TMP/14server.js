// Node.js #14 Обработка POST запросов (Handling Post Requests)
// // 01:45 PAUSE - SM LINE 46

const express = require('express');
const path = require('path');
const morgan = require('morgan')

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.listen(PORT, (error) => {
        error ? console.log(error) : console.log(`listening port ${PORT}`);
    }) /


    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({ extended: false })); //внутрь принимает аргументы (в нашем случае - extended: false, т.к. расширенный парсинг нам не нужен)

app.use(express.static('styles'));

app.get('/', (req, res) => {
    const title = 'Home';
    res.render(createPath('index'), { title });
});

app.get('/contacts', (req, res) => {
    const title = 'Contacts';
    const contacts = [
        { name: 'YouTube', link: 'http://youtube.com/YauhenKavalchuk' },
        { name: 'Twitter', link: 'http://twitter.com/YauhenKavalchuk' },
        { name: 'GitHub', link: 'http://github.com/YauhenKavalchuk' },
    ]
    res.render(createPath('contacts'), { contacts, title });
});

//Добавляем "моковые" данные в файл сервера (Mock-объект (от англ. mock object, букв. — «объект-пародия», «объект-имитация», а также «подставка») — в ООП — тип объектов, реализующих заданные аспекты моделируемого программного окружения. Mock-объект представляет собой конкретную фиктивную реализацию интерфейса, предназначенную исключительно для тестирования взаимодействия и относительно которого высказывается утверждение. Mock-объекты активно используются в разработке через тестирование.)

app.get('/posts/:id', (req, res) => {
    const title = 'Post';
    const post = { //post будет представлять из себя обычный объект
        id: '1', // поле id нужно для уникального идентификатора, который мы будем использовать для роутинга, его же мы будем использовать при удалении и редактировании данных
        text: 'You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out.', //text - это полный текст статьи
        title: 'Post title', //title - заголовок
        date: '12/02/2022', //доп информация - дата
        author: 'Nemo', // доп инф - автор
    };
    res.render(createPath('post'), { title, post }); // данные post мы должны передать в файл шаблона. Для этого в объект, который мы передаем в метод .render вторым аргументом отправляем созданный объект post. После этого переходим внутрь шаблона post.ejs
});

// Теперь все тоже самое для файла posts.ejs, но сначала вносим изменения здесь - в сервере:

app.get('/posts', (req, res) => {
    const title = 'Posts';
    const posts = [{ //поскольку post - этомассив всех новостей, то все, что нам нужно сделать - это создать массив posts и скопировать в него объект с одним постом
        id: '1',
        text: 'You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out.',
        title: 'Post title',
        date: '12/02/2022',
        author: 'Nemo', // 
    }]
    res.render(createPath('posts'), { title, posts }); // по аналогии передаем данные о наборе новостей в соответствующий шаблон - posts.ejs - переходим в него...
    // после этого мы можем поработать с post-запросом. Этот тип запроса помогает отправлять информацию на сервер.
    // чтобы мы могли отправлять какие-то данные у нас есть файл add-post.ejs, который содержит форму (идем в этот файл)
});

// После редактирования add-post.ejs первое, что нужно сделать - это добавить мидлвар для парсинга входящего запросаю Для этого используем метод express.urlencoded (см. строку 23 + http://expressjs.com/en/4x/api.html#express.urlencoded (можно почитать об остальных аргументах))

// После того, как мидлвар подключен в файл сервера, создаем роут, который будет обрабатывать получаемые данные. В качестве метода будем использовать .post, все остальное идет по аналогии

app.post('/add-post', (req, res) => { //указываем роут, на котором будет происходить обработка и передаем callback, где будет описана логика
    const { title, author, text } = req.body; //из тела завпроса при помощи деструктуризации вытягиваем title, author, text
    const post = { // создаем новый объект post, который будет содержать эти поля. Важно, чтобы здесь были все поля, которые использует шаблон post.ejs, т.к. мы к нему обращаемся ниже
        id: new Date(), //добавили поле id: куда присвоили new Date()
        date: (new Date()).toLocaleDateString(), // добавили поле date: куда также присвоили (new Date()) и взяли метод .toLocaleDateString(), чтобы дата отображалась в нормальном формате
        title,
        author,
        text,
    }
    res.render(createPath('post'), { post, title }); //внутри указываем путь до файла post, и в качестве аргумента созданный объект post, а также значения title, которое мы используем для вкладки браузера
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