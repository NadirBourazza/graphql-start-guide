var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Car {
    id: ID!
    make: String
    model: String
    year: Int!
    color: String
  }

  input CarInput {
    make: String
    model: String
    year: Int!
    color: String
  }

  type Advert { 
    id: ID!
    title: String!
    car: Car!
    price: Int!
    location: String
  }

  input AdvertInput {
    title: String!
    car: CarInput!
    price: Int!
    location: String
  }

  type Mutation {
    createAdvert(title: String!, car: CarInput!, price: Int!, location: String): Advert
    updateAdvert(id: ID!, title: String, car: CarInput, price: Int, location: String): Advert
    deleteAdvert(id: ID!): Advert
  }

  type Query { 
    getAdvert(id: ID!): Advert
    getAdverts: [Advert]
    getCar(id: ID!): Car
    getCars: [Car]
  }
`);

class Advert {
  constructor(id, {title, car, price, location}){
    this.id = id;
    this.title = title;
    this.car = car;
    this.price = price;
    this.location = location;
  }
};

var fakeDatabase = {};

var root = { 
  createAdvert: ({title, car, price, location}) => {
    var id = require('crypto').randomBytes(10).toString('hex');
    fakeDatabase[id] = new Advert(id, {title, car, price, location});
    return fakeDatabase[id];
  },
  updateAdvert: ({id, title, car, price, location}) => {
    if(!fakeDatabase[id]){
      throw new Error('No advert exists with id ' + id);
    }
    if(title){
      fakeDatabase[id].title = title;
    }
    if(car){
      fakeDatabase[id].car = car;
    }
    if(price){
      fakeDatabase[id].price = price;
    }
    if(location){
      fakeDatabase[id].location = location;
    }
    return fakeDatabase[id];
  },
  deleteAdvert: ({id}) => {
    if(!fakeDatabase[id]){
      throw new Error('No advert exists with id ' + id);
    }
    var advert = fakeDatabase[id];
    delete fakeDatabase[id];
    return advert;
  },
  getAdvert: ({id}) => {
    if(!fakeDatabase[id]){
      throw new Error('No advert exists with id ' + id);
    }
    return fakeDatabase[id];
  },
  getAdverts: () => {
    var adverts = [];
    for(var id in fakeDatabase){
      adverts.push(fakeDatabase[id]);
    }
    return adverts;
  },
  getCar: ({id}) => {
    if(!fakeDatabase[id]){
      throw new Error('No car exists with id ' + id);
    }
    return fakeDatabase[id].car;
  },
  getCars: () => {
    var cars = [];
    for(var id in fakeDatabase){
      cars.push(fakeDatabase[id].car);
    }
    return cars;
  }
};

var app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));