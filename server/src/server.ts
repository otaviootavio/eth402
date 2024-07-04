import Fastify from "fastify";
import IORedis from "ioredis";
import { addBalanceSchema } from "./schemas/addBalanceSchema";
import { addPaymentMiddleware } from "./middleware/addPaymentMiddleware";
import { secretSchema } from "./schemas/secretSchema";
import { requirePaymentMiddleware } from "./middleware/requirePaymentMiddleware";

export const server = Fastify({
  logger: true,
});

const redis = new IORedis();

server.decorate("redis", redis);

server.post<{ Querystring: { txid: `0x${string}`; userBalance?: bigint } }>(
  "/add",
  {
    schema: addBalanceSchema,
    preHandler: addPaymentMiddleware,
  },
  async function (request, reply) {
    try {
      if (request.query.userBalance === undefined) {
        throw new Error("userBalance not set in middleware");
      }
      reply.send({
        message: "Balance updated",
        balance: request.query.userBalance,
      });
    } catch (error) {
      console.log(error);
      reply
        .status(500)
        .send({ error: "An error occurred while processing the transaction" });
    }
  }
);

server.get<{ Querystring: { address: string; userBalance?: bigint } }>(
  "/secret",
  {
    schema: secretSchema,
    preHandler: requirePaymentMiddleware,
  },
  async function (request, reply) {
    try {
      if (request.query.userBalance === undefined) {
        throw new Error("userBalance not set in middleware");
      }

      reply.send("secret!");
    } catch (error) {
      console.log(error);
      reply
        .status(500)
        .send({ error: "An error occurred while retrieving the secret" });
    }
  }
);

server.listen({ port: 3000 }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening at ${address}`);
});
