import { FastifyInstance } from "fastify";
import { secretSchema } from "../schemas/secretSchema";
import { verifySignatureMiddleware } from "../middleware/verifySignatureMiddleware";
import { requirePaymentMiddleware } from "../middleware/requirePaymentMiddleware";
import IORedis from "ioredis";

export const secretRoutes = (server: FastifyInstance, redis: IORedis) => {
  server.post<{ Body: SecretRequestBody }>(
    "/secret",
    {
      schema: secretSchema,
      preHandler: [
        verifySignatureMiddleware(),
        requirePaymentMiddleware(redis),
      ],
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
};
