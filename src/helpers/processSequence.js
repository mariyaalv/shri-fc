/**
 * @file Домашка по FP ч. 2
 *
 * Составляем цепочку синхронных и асинхронных действий для обработки строки-числа.
 * API:
 *   GET https://api.tech/numbers/base?number={number}&from=10&to=2 — конвертация
 *   GET https://animals.tech/{id} — получение животного по id
 *
 * В случае ошибок валидации — handleError('ValidationError'),
 * при успешном завершении — handleSuccess(result).
 */

import Api from "../tools/api";
import { length, test } from "ramda";

const api = new Api();

// Валидация исходной строки
const longerThanTwo = (str) => length(str) > 2;
const shorterThanTen = (str) => length(str) < 10;
const isNumberOrDot = test(/^[0-9]+(?:\.[0-9]+)?$/);
const validateString = (value) =>
  longerThanTwo(value) && shorterThanTen(value) && isNumberOrDot(value);

// Преобразования
const strToRoundedNumber = (value) => Math.round(parseFloat(value));
const convertToBinary = (num) =>
  api
    .get("https://api.tech/numbers/base", { from: 10, to: 2, number: num })
    .then(({ result }) => result);
const getLength = (str) => str.length;
const square = (num) => num * num;
const getRemainder = (num) => num % 3;
const fetchAnimal = (id) =>
  api.get(`https://animals.tech/${id}`, {}).then(({ result }) => result);

// Главная функция
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  // Асинхронная цепочка через Promise.resolve
  Promise.resolve(value)
    .then((val) => {
      writeLog(val);
      // Валидация
      if (!validateString(val)) throw "ValidationError";
      return val;
    })
    .then(strToRoundedNumber)
    .then((num) => {
      writeLog(num);
      return num;
    })
    .then(convertToBinary)
    .then((bin) => {
      writeLog(bin);
      return bin;
    })
    .then(getLength)
    .then((len) => {
      writeLog(len);
      return len;
    })
    .then(square)
    .then((sq) => {
      writeLog(sq);
      return sq;
    })
    .then(getRemainder)
    .then((rem) => {
      writeLog(rem);
      return rem;
    })
    .then(fetchAnimal)
    .then(handleSuccess)
    .catch((err) => {
      if (err === "ValidationError") handleError("ValidationError");
      else handleError(err);
    });
};

export default processSequence;
