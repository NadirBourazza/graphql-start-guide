var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }`
);

// Provide resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello World!";
  }
}

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