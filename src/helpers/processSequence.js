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
import { length, test, pipeWith, tap } from "ramda";

const api = new Api();

// Валидация исходной строки
const validateString = (value) =>
  length(value) > 2 &&
  length(value) < 10 &&
  test(/^[0-9]+(?:\.[0-9]+)?$/)(value);
const throwIfInvalid = (val) => {
  if (!validateString(val)) throw "ValidationError";
  return val;
};

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

// Основной pipeline через Ramda.pipeWith для промисов
const pipeline = (writeLog) =>
  pipeWith(
    (fn, res) => Promise.resolve(res).then(fn),
    [
      tap(writeLog), // лог исходного значения
      throwIfInvalid, // валидация
      tap(writeLog), // лог после валидации
      strToRoundedNumber,
      tap(writeLog), // лог числа
      convertToBinary,
      tap(writeLog), // лог бинарной строки
      getLength,
      tap(writeLog), // лог длины
      square,
      tap(writeLog), // лог квадрата
      getRemainder,
      tap(writeLog), // лог остатка
      fetchAnimal, // получение животного
    ]
  );

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  pipeline(writeLog)(value)
    .then(handleSuccess)
    .catch((err) => {
      handleError(err === "ValidationError" ? "ValidationError" : err);
    });
};

export default processSequence;
