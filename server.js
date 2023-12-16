var {graphql, buildSchema} = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }`
);

// Provide resolver function for each API endpoint
var rootValue = {
  hello: () => {
    return "Hello World!";
  }
}

// Run the GraphQL query '{hello}' and print out the response
graphql({
  schema, 
  source: '{hello}', 
  rootValue
}).then((response) => {
  console.log(response);
});