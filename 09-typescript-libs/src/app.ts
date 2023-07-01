// import 'reflect-metadata';
import { Product } from './product-model';
// import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

const products = [
  { title: 'Carpet', price: 29.99 },
  { title: 'A Book', price: 10.99 },
];

const newProd = new Product('', -5.99);
validate(newProd).then((errors) => {
  if (errors.length > 0) {
    console.log(errors);
  } else {
    console.log(newProd.getInformation());
  }
});

// const loadedProducts = plainToInstance(Product, products);

// for (const product of loadedProducts) {
//   console.log(product.getInformation());
// }
