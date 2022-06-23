// Node.js #6 Буфер и потоки (Buffer & Streams)

// 1 - ЧИТАЮЩИЙ ПОТОК   -   Readable

// const fs = require('fs'); //подключаем модуль файловой системы

// const readStream = fs.createReadStream('./6docs/text.txt'); //создаем ЧИТАЮЩИЙ поток, присваиваем ему работу метода .createReadStream в который передаем путь к файлу

// readStream.on('data', (chunk) => {
//         console.log('-------'); //добавили разделитель ------- между порциями для наглядности
//         console.log(chunk); //console.log(chunk.toString()); для вывода в консоли в виде текста, а не буфера
//     }) //методом .on включаем чтение потока - внутрь него передаем 2 аргумента - событие 'data' и callback, который будет принимать порции данных (chunk)

// 2 - ЗАПИСЫВАЮЩИЙ ПОТОК   -   Writable - 03:24

// const fs = require('fs');

// const readStream = fs.createReadStream('./6docs/text.txt');
// const writeStream = fs.createWriteStream('./6docs/new-text.txt'); //создаем константу пишущего потока используя метод .createWriteStream в качестве аргумента передаем путь и имя файла, который создаем

// readStream.on('data', (chunk) => {
//         writeStream.write('\n---CHUNK START---\n'); //добавляем метки в начале и в конце куска
//         writeStream.write(chunk); //добавляем записывающий поток внутрь читающего
//         writeStream.write('\n---END CHUNK---\n');

//     }) //сначала будет происходить чтение большого файла по кускам, и каждый прочитанный кусок мы будем передавать записывающим потоком в новый файл

// 3 - ДУПЛЕКСНЫЙ ПОТОК   -   Duplex - 04:45

// const fs = require('fs');

// const readStream = fs.createReadStream('./6docs/text.txt');
// const writeStream = fs.createWriteStream('./6docs/new-text.txt')

// //улучшение логики передачи данных - создаем функцию handleError
// const handleError = () => { //внутри данной функции
//     console.log('Error'); // вывели в консоль сообщение об ошибке
//     readStream.destroy(); // если в момент чтения данных происходит ошибка, то с помощью метода .destroy будем уничтожать читающий поток, т.к. поврежденные данные нам не нужны
//     writeStream.end('Finished whis error...'); // а в записывающий поток добавим информацию, что при чтении произошла ошибка и сохраненный файл записан с ошибкой. Метод .end добавит нужную строку в конце
// }

// // функцию handleError создали, теперь нужно ее добавить МЕЖДУ операциями ЧТЕНИЯ и ЗАПИСИ. Для этого мы используем цепочку методов: на readStream вешаем метод .on, который будет слушать ошибки чтения и вызывать функцию handleError и аналогичные действия мы делаем после .pipe, чтобы если при записи произойдет ошибка мы также о ней знали и уничтожали дальнейшее чтение и попытки записи.

// readStream
//     .on('error', handleError)
//     .pipe(writeStream)
//     .on('error', handleError);

// readStream.pipe(writeStream); //метод .pipe осуществляет чтение получаемых данных из readStream и передает их напрямую в writeStream.
// //Т.е. мы берем поток чтения и используем метод .pipe внутрь которого передаем поток записи

// 4 - ТРАНСФОРМИРУЮЩИЙ или ПРЕОБРАЗУЮЩИЙ ПОТОК   -   Transform - 06:36

const fs = require("fs");
const zlib = require("zlib"); // подключаем модуь сжатия zlib

const readStream = fs.createReadStream("./6docs/text.txt");
const writeStream = fs.createWriteStream("./6docs/new-text.zip");
const compressStream = zlib.createGzip(); //создаем преобразующий (в нашем случае - сжимающий) поток и вызываем метод .createGzip

function handleError() {
  console.log("Error");
  readStream.destroy();
  writeStream.end("Finished whis error...");
}

readStream
  .on("error", handleError)
  .pipe(compressStream) // добавили преобразующий поток в общий поток. Т.о. данные будут сжиматься и записываться в файл
  .pipe(writeStream)
  .on("error", handleError);
