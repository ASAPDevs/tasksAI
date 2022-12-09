const express = require('express');
const app = express();
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const {typeDefs, resolvers} = require('./schema');

const PORT = 3000;
//intiate a new Apollo graphQL server here.
async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({typeDefs, resolvers});
  await server.start();
  server.applyMiddleware({app, path: "/graphql"});
}


app.listen(PORT, () => {
  console.log("LISTENING ON PORT: ", PORT)
})

startApolloServer(typeDefs, resolvers);

module.exports = app;