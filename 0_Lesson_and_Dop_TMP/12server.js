// Node.js #12 Подключение шаблонизатора (View Engine)
// создадим пользовательский интерфейс и превратим статичные страницы в динамичные, которые будут получать данные от сервера и рендерить (воспроизводить) их
// в папке views появились новые страницы: add-post, post, posts. Чтобы увидеть как они выглядят добавим их в файле сервера 

const express = require('express');

const path = require('path');

const app = express();

// подключаем ejs в ТРИ ШАГА. ПОСЛЕ этого у нас появляются новые возможности.

// 1 - partial template (частичный шаблон) - чтобы инкапсулировать повторяющиеся части, например навигацию в страницах:
// создаем папку partials в которой создаем файл nav.ejs, открываем любой файл (например index.ejs) и вырезаем из него блок с навигацией (код, находящийся между тегами <nav> и </nav>, включая эти тэги). Вырезанный блок с навигацией вставляем в файл nav.ejs, а в том месте, где мы его вырезали вставляем стандартный синтаксис ejs, у которого в начале и в конце мы добавляем знак %. В остальном он похож на обычный тэг. Внутри мы указываем диррективу include в которую передаем путь до файла с навигацией:
//  <%- include('./partials/nav.ejs') %>
// копируем эту сроку и заменяем таким образом навигацию во всех остальных шаблонах папки ejs-views

// ПОДРОБНЕЕ О РАЗЛИЧНЫХ КОНСТРУКЦИЯХ EJS МОЖНО ПОЧИТАТЬ НА ОФИЦИАЛьНОМ САЙТЕ С ДОКУМЕНТАЦИЕЙ: https://ejs.co/


// Теперь рассмотрим ПЕРЕДАЧУ ДАННЫХ ШАБЛОННЫХ СТРАНИЦ. (Для начала базовый механизм на примере страницы контактов - 05:23)
// С сервера мы можем отдавать любое количество данных
// В тэге ejs мы можем описать любой JavaScript код. В примере мы создадим переменную, но это может быть и функция и любая другая логика
// <% const name = 'Jack' %> 
// <li><%= name %></li> // используя такой же синтаксис, но добавив = мы обращаемся к пространству имен шаблонизатора и вытягиваем значение name
// основная задача заключается в том, чтобы на сервере формировать нужные данные и от правлять их в шаблон


app.set('view engine', 'ejs'); // ШАГ 1: устанавливаем для нашего приложения ejs в качестве view engine 

const PORT = 3000;

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`); // ШАГ 2: обновим createPath: все статичные страницы из папки views скопируем в папку ejs-views, изменив расширение с .html на .ejs. Это же расширение (.ejs) и папку (ejs-views) нужно использовать для построения пути до файла

app.listen(PORT, (error) => {
        error ? console.log(error) : console.log(`listening port ${PORT}`);
    }) /

    app.get('/', (req, res) => {
        const title = 'Home'; // в каждый роут добавляем константу title - Home - для главной страницы
        res.render(createPath('index'), { title }); // ШАГ 3: заменяем метод sendFile на метод render (воспроизвести). В каждом из описанных роутов наше приложение начнет использовать ejs в качестве шаблонизатора для страниц
    });

// ДОБАВИМ СВОЙ ИНДИВИДУАЛЬНЫЙ TITLE (значение, которое отбражается на вкладке браузера) ДЛЯ КАЖДОЙ СТРАНИЦЫ - 07:37
// для этого в каждый роут добавляем константу title и передаем это значение вторым аргументом для каждого роута
// после этого переходим в каждый шаблон ejs и обновляем тэг title до вида:
//     <title>Node.js Course | <%= title %></title>

app.get('/contacts', (req, res) => {
    const title = 'Contacts'; // в каждый роут добавляем константу title
    const contacts = [ // добавляем массив с контактами
        { name: 'YouTube', link: 'http://youtube.com/YauhenKavalchuk' }, // формируем список социальных сетей, 
        { name: 'Twitter', link: 'http://twitter.com/YauhenKavalchuk' }, // после этого в шаблоне contacts.ejs 
        { name: 'GitHub', link: 'http://github.com/YauhenKavalchuk' }, // нужно этот список отрендерить:
        // код ниже в файле contacts.ejs
        // тут вступает в силу специфический синтаксис шаблонизатора: к каждой операции в фигурных скобках мы должны добавить обертку ejs <%  %>
        // <ul>
        // <% if (contacts.length) { %>  // проверяем логикой существуют ли отправляемые данные
        //     <% contacts.forEach(({ link, name }) => { %>  // с помощью .forEach пробегаемся по получаемым данным  
        //         <li>
        //             <a href="<%= link %>"><%= name %></a> // и строим соответствующую разметку - тэг li, внутри коготорого будет находиться ссылка, динамически получающая данные из полей link и name
        //         </li>
        //         <% }) %>
        //             <% } %>
        // </ul>
    ]
    res.render(createPath('contacts'), { contacts, title }); // в метод render вторым аргументом передаем данные массива // и значение title 
});

app.get('/posts/:id', (req, res) => { // использует передаваемый в url-адресе id, для отображения одного конкретно запрашиваемого поста
    const title = 'Post'; // в каждый роут добавляем константу title
    res.render(createPath('post'), { title }); // ШАГ 3: заменяем метод sendFile на метод render (воспроизвести). // и передаем значение title вторым аргументом для каждого роута
});

app.get('/posts', (req, res) => {
    const title = 'Posts'; // в каждый роут добавляем константу title
    res.render(createPath('posts'), { title }); // ШАГ 3: заменяем метод sendFile на метод render (воспроизвести). // и передаем значение title вторым аргументом для каждого роута
});

app.get('/add-post', (req, res) => {
    const title = 'Add Post'; // в каждый роут добавляем константу title
    res.render(createPath('add-post'), { title }); // ШАГ 3: заменяем метод sendFile на метод render (воспроизвести). // и передаем значение title вторым аргументом для каждого роута
});

app.get('/about-us', (req, res) => {
    res.redirect('/contacts');
})

app.use((req, res) => {
    const title = 'Error Page'; // в каждый роут добавляем константу title
    res
        .status(404)
        .render(createPath('error'), { title }); // ШАГ 3: заменяем метод sendFile на метод render (воспроизвести). // и передаем значение title вторым аргументом для каждого роута
})