import {
  equals,
  curry,
  allPass,
  pipe,
  values,
  filter,
  countBy,
  identity,
  gte,
  length,
  toPairs,
  any,
  anyPass,
  complement,
  all,
  prop,
  __,
} from "ramda";
import { COLORS } from "../constants";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// Функции-предикаты на цвета
const isColor = (color) => equals(color);
const isRed = isColor(COLORS.RED);
const isOrange = isColor(COLORS.ORANGE);
const isGreen = isColor(COLORS.GREEN);
const isBlue = isColor(COLORS.BLUE);
const isWhite = isColor(COLORS.WHITE);

// Функция-предикат на фигуры
const isShapeColor = curry((shapeName, colorPred, shapes) =>
  colorPred(shapes[shapeName])
);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isShapeColor("triangle", isWhite),
  isShapeColor("circle", isWhite),
  isShapeColor("star", isRed),
  isShapeColor("square", isGreen),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) =>
  gte(length(filter(isGreen, values(shapes))), 2);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) =>
  equals(
    length(filter(isRed, values(shapes))),
    length(filter(isBlue, values(shapes)))
  );

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isShapeColor("circle", isBlue),
  isShapeColor("star", isRed),
  isShapeColor("square", isOrange),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
  values,
  countBy(identity),
  toPairs,
  filter(([color]) => color !== COLORS.WHITE),
  any(([_, count]) => gte(count, 3))
);

const countColor = (colorPred) => pipe(values, filter(colorPred), length);
// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  (shapes) => countColor(isGreen)(shapes) === 2,
  isShapeColor("triangle", isGreen),
  (shapes) => countColor(isRed)(shapes) === 1,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(values, all(equals(COLORS.ORANGE)));


const isRedOrWhite = anyPass([isRed, isWhite]);
const isNotRedOrWhite = complement(isRedOrWhite);
// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = pipe(prop("star"), isNotRedOrWhite);

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(values, all(equals(COLORS.GREEN)));


const isNotWhite = complement(isWhite);
// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  ({ triangle, square }) => equals(triangle, square),
  ({ triangle }) => isNotWhite(triangle),
]);
