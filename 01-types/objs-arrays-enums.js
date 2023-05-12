"use strict";
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
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
})(Role || (Role = {}));
const person = {
    name: 'Santiago',
    age: 23,
    hobbies: ['Sports', 'Cooking'],
    role: Role.ADMIN,
};
let favoriteActivities;
favoriteActivities = ['Sports'];
console.log(person.name);
for (const hobby of person.hobbies) {
    console.log(hobby.toUpperCase());
}
