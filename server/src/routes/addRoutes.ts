import { FastifyInstance } from "fastify";
import { addBalanceSchema } from "../schemas/addBalanceSchema";
import { verifySignatureMiddleware } from "../middleware/verifySignatureMiddleware";
import { addPaymentMiddleware } from "../middleware/addPaymentMiddleware";
import IORedis from "ioredis";
import { type AddRequestBody } from "../types/AddRequestBody";

export const addRoutes = (server: FastifyInstance, redis: IORedis) => {
  server.post<{ Body: AddRequestBody }>(
    "/add",
    {
      schema: addBalanceSchema,
      preHandler: [verifySignatureMiddleware(), addPaymentMiddleware(redis)],
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
        reply.status(500).send({
          error: "An error occurred while processing the transaction",
        });
      }
    }
  );
};
