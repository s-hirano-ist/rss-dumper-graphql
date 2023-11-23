import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Context, createContext } from "./context";
import { schema } from "./schema";

// FYR: it might be better to use expressMiddleware instead of startStandaloneServer for security issues.
// https://www.apollographql.com/docs/apollo-server/api/standalone#swapping-to-expressmiddleware
const PORT = Number(process.env.PORT);

const start = async () => {
  const server = new ApolloServer<Context>({ schema, csrfPrevention: true });

  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: isNaN(PORT) ? 4000 : PORT },
  });

  console.log(`🚀 Server ready at: ${url}`);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start();
