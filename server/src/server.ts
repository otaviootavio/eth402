import Fastify from "fastify";
import { addRoutes } from "./routes/addRoutes";
import { secretRoutes } from "./routes/secretRoutes";
import { createRedisClient } from "./services/redisServices";
import { serverRoutes } from "./routes/serverRoutes";

export const createServer = () => {
  const server = Fastify({
    logger: true,
  });

  const redis = createRedisClient();

  server.decorate("redis", redis);

  // Register routes
  addRoutes(server, redis);
  secretRoutes(server, redis);
  serverRoutes(server);

  return { server, redis };
};

const { server } = createServer();

server.listen({ port: 4000 }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening at ${address}`);
});
