import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { setupDatabase } from './database';

async function startServer() {
  const app = express();
  
  // Setup database connection
  await setupDatabase();

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Apply middleware
  app.use(cors());
  app.use(json());
  app.use('/graphql', expressMiddleware(server, {
    context: createContext,
  }));

  // Start server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 