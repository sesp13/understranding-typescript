// const person: {
//   name: string;
//   age: number;
//   hobbies: string[],
//   role: [number, string]
// } = {
//   name: 'Santiago',
//   age: 23,
//   hobbies: ['Sports', 'Cooking'],
//   role: [2, 'author'],
// };

enum Role {
  ADMIN = 'ADMIN',
}

const person = {
  name: 'Santiago',
  age: 23,
  hobbies: ['Sports', 'Cooking'],
  role: Role.ADMIN,
};

let favoriteActivities: string[];
favoriteActivities = ['Sports'];

console.log(person.name);
for (const hobby of person.hobbies) {
  console.log(hobby.toUpperCase());
}
