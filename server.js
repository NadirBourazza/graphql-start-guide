var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
`);

// This class implements the RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides)
  }

  roll({numRolls}) {
    var output = []
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce())
    }
    return output
  }
}



// Provide resolver function for each API endpoint
var root = {
  getDie:({numSides}) => new RandomDie(numSides || 6)
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