import { FastifyRequest, FastifyReply } from "fastify";
import { getTxByTxHash } from "../utils/getTxByTxHash";
import { envLoader } from "../envLoader";
import { addPaymentSchema } from "../schemas/addPaymentSchema";
import IORedis from "ioredis";

export const addPaymentMiddleware =
  (redis: IORedis) =>
  async (
    request: FastifyRequest<{ Body: AddRequestBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { txid } = request.body;
      const txUsedKey = `txid:${txid.toLowerCase()}`;

      // Verifica se a transação já foi usada
      const txUsed = await redis.get(txUsedKey);
      if (txUsed) {
        reply.status(400).send({ error: "Transaction already used" });
        return;
      }

      const { from, to, value } = await getTxByTxHash(txid);

      if (!to) throw new Error();

      if (to.toLowerCase() !== envLoader.SERVER_ADDRESS.toLowerCase()) {
        reply
          .status(402)
          .send(`Payment required to address ${envLoader.SERVER_ADDRESS}`);
        return;
      } else {
        const balanceKey = `balance:${from.toLowerCase()}`;

        // Adiciona ou atualiza o saldo do usuário no Redis
        let userBalance = await redis.get(balanceKey);
        let newBalance = BigInt(userBalance || "0") + value;

        await redis.set(balanceKey, newBalance.toString());
        await redis.set(txUsedKey, "used");

        // Validação do schema com Zod
        const result = addPaymentSchema.safeParse({
          txid,
          userBalance: newBalance,
        });
        if (!result.success) {
          reply.status(400).send({ error: "Invalid data" });
          return;
        }

        request.body.userBalance = newBalance; // Adiciona o saldo atualizado ao request para uso posterior
      }
    } catch (error) {
      console.log(error);
      reply
        .status(500)
        .send({ error: "An error occurred while processing the transaction" });
    }
  };
