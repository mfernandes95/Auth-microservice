const faker = require("faker");
const { factory } = require("factory-girl");
const { User } = require("../src/app/models");
const { Car } = require("../src/app/models");

factory.define("User", User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define("Car", Car, {
  brand: "Ford",
  model: "AWS",
  year: 2018,
  fuel: "DIESEL",
  color: "white",
  price: 100000.0,
});

// factory.define("Car", Car, {
//   brand: faker.name.findName(),
//   model: faker.name.findName(),
//   year: 2018,
//   fuel: faker.vehicle.fuel(),
//   color: faker.commerce.color(),
//   price: faker.commerce.price(),
// });

module.exports = factory;
