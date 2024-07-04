import { FastifyInstance } from "fastify";
import { envLoader } from "../envLoader";
import { getAddressSchema } from "../schemas/getAddressSchema";

export const serverRoutes = (server: FastifyInstance) => {
  server.get(
    "/address",
    {
      schema: getAddressSchema,
    },
    async function (request, reply) {
      try {
        reply.send(envLoader.SERVER_ADDRESS);
      } catch (error) {
        console.log(error);
        reply
          .status(500)
          .send({ error: "An error occurred while retrieving the secret" });
      }
    }
  );
};
