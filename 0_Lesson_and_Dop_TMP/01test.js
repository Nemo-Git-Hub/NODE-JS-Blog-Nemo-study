const userName = "Nemo"; //объявили константу для имени

const sayHi = (userName) => `Hello, my name is ${userName}`; //создали функцию sayHi, которая в качестве аргумента принимает имя и возвращает строку приветствия

// console.log(sayHi(userName)); // полученный результат выводим в консоль

// module - это глобальный объект экспорта данных в другое место - создание модуля
module.exports = {
  userName,
  sayHi,
}; // свойству .exports присвоили объект (а можно одну переменную) {в котором описали экспортируемые данные} в модуль, чтобы использовать в другом месте
