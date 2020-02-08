require('dotenv').config();
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './database/index';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers/index';
const PORT = process.env.PORT;

const mount = async (app: Application) => {
  const db = await connectDatabase();

  app.use(cookieParser(process.env.SECRET));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res })
  });
  server.applyMiddleware({ app, path: '/api' });
  app.listen(PORT);
  console.log(`[app]: http://localhost:${PORT}`);
  const listings = await db.listings.find({}).toArray();
  console.log(listings);
};

mount(express());
