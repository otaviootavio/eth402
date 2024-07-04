import Fastify from "fastify";
import IORedis from "ioredis";
import { addBalanceSchema } from "./schemas/addBalanceSchema";
import { secretSchema } from "./schemas/secretSchema";

import { getTxByTxHash } from "./utils/getTxByTxHash";
import { envLoader } from "./envLoader";

const fastify = Fastify({
  logger: true,
});

const redis = new IORedis();

fastify.post<{ Querystring: { txid: `0x${string}` } }>(
  "/add",
  { schema: addBalanceSchema },
  async function (request, reply) {
    try {
      const { txid } = request.query;
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
      } else {
        const balanceKey = `balance:${from.toLowerCase()}`;

        // Adiciona ou atualiza o saldo do usuário no Redis
        let userBalance = await redis.get(balanceKey);
        let newBalance = BigInt(userBalance || "0") + value;

        await redis.set(balanceKey, newBalance.toString());
        await redis.set(txUsedKey, "used");

        reply.send({ message: "Balance updated", balance: newBalance });
      }
    } catch (error) {
      console.log(error);
      reply
        .status(500)
        .send({ error: "An error occurred while processing the transaction" });
    }
  }
);

fastify.get<{ Querystring: { address: string } }>(
  "/secret",
  { schema: secretSchema },
  async function (request, reply) {
    try {
      const { address } = request.query;
      const balanceKey = `balance:${address.toLowerCase()}`;

      // Verifica o saldo do usuário
      let userBalance = await redis.get(balanceKey);
      if (userBalance === null || parseFloat(userBalance) < 1) {
        reply.status(402).send(`Insufficient balance.`);
        return;
      }

      // Deduz 1 do saldo do usuário
      let newBalance = parseInt(userBalance) - 1;
      await redis.set(balanceKey, newBalance.toString());

      reply.send("secret!");
    } catch (error) {
      console.log(error);
      reply
        .status(500)
        .send({ error: "An error occurred while retrieving the secret" });
    }
  }
);

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
