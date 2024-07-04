import Fastify from "fastify";
import IORedis from "ioredis";
import { addBalanceSchema } from "./schemas/addBalanceSchema";
import { addPaymentMiddleware } from "./middleware/addPaymentMiddleware";
import { secretSchema } from "./schemas/secretSchema";
import { requirePaymentMiddleware } from "./middleware/requirePaymentMiddleware";
import { verifySignatureMiddleware } from "./middleware/verifySignatureMiddleware";

export const server = Fastify({
  logger: true,
});

const redis = new IORedis();

server.decorate("redis", redis);

server.post<{ Body: AddRequestBody }>(
  "/add",
  {
    schema: addBalanceSchema,
    preHandler: [verifySignatureMiddleware, addPaymentMiddleware],
  },
  async function (request, reply) {
    try {
      if (request.body.userBalance === undefined) {
        throw new Error("userBalance not set in middleware");
      }
      reply.send({
        message: "Balance updated",
        balance: request.body.userBalance,
      });
    } catch (error) {
      console.log(error);
      reply
        .status(500)
        .send({ error: "An error occurred while processing the transaction" });
    }
  }
);

server.post<{ Body: SecretRequestBody }>(
  "/secret",
  {
    schema: secretSchema,
    preHandler: [verifySignatureMiddleware, requirePaymentMiddleware],
  },
  async function (request, reply) {
    try {
      if (request.body.userBalance === undefined) {
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
