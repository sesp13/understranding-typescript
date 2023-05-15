const username = 'Max';

// username = 'Hugo'; - ERROR

let age = 29;
age = 30;

function add(a: number, b: number = 5) {
  let result;
  result = a + b;
  return result;
}

if (age > 20) {
  // let isOld = true;
}

// console.log(isOld);

const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];

activeHobbies.push(...hobbies);

const person = {
  name: 'max',
  age: 36,
};

const copiedPerson = { ...person };

const addNumbers = (...params: number[]) => {
  return params.reduce(
    (currentResult, currentValue) => currentResult + currentValue,
    0
  );
};

const addedNumbers = addNumbers(1, 2, 3, 5, 9);
