const names: Array<string> = ['Max', 'Manuel'];

const promise: Promise<string> = new Promise((resolve) => {
  setTimeout(() => {
    resolve('This is done!!');
  }, 2000);
});

promise.then((data) => data.split(''));

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObject = merge({ name: 'Max' }, { age: 25 });
console.log(mergedObject);

interface Lengthy {
  length: number;
}

const countAndDescribe = <T extends Lengthy>(element: T): [T, string] => {
  let descriptionText = 'Got no value';
  if (element.length === 1) {
    descriptionText = `Got 1 element`;
  } else if (element.length > 1) {
    descriptionText = `Got ${element.length} elements`;
  }
  return [element, descriptionText];
};

console.log(countAndDescribe('Hi there!'));
console.log(countAndDescribe(['Hi there']));
console.log(countAndDescribe([]));

function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return `Value ${obj[key]}`;
}

console.log(extractAndConvert({ name: 'Max' }, 'name'));

class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) return;
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const textstorage = new DataStorage<string>();
textstorage.addItem('Max');
textstorage.addItem('Manu');
textstorage.removeItem('Max');
console.log(textstorage.getItems());

// const objStorage = new DataStorage<object>();
// objStorage.addItem({ name: 'Max' });
// objStorage.addItem({ name: 'Manu' });
// objStorage.removeItem({ name: 'Manu' });
// console.log(objStorage.getItems());

interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  const courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;

  return courseGoal as CourseGoal;
}

const namesReadOnly: Readonly<string[]> = ['Max', 'Manu'];
// namesReadOnly.push('Anna');
