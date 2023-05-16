// type AddFn = (a: number, b: number) => number;
interface AddFn {
  (a: number, b: number): number;
}

let add: AddFn;
add = (n1: number, n2: number) => n1 + n2;

interface Named {
  readonly name?: string;
  outName?: string;
}
interface Greetable extends Named {
  greet(phrase: string): void;
}

class Person implements Greetable {
  name?: string;
  age: number = 30;
  constructor(n: string) {
    if (n) {
      this.name = n;
    }
  }

  greet(phrase: string): void {
    console.log(`${phrase} ${this.name}`);
  }
}

let user1: Greetable;
user1 = new Person('Max');
user1.greet('Hello');
