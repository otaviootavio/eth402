import { FastifyRequest, FastifyReply } from "fastify";
import IORedis from "ioredis";
import { z } from "zod";

const redis = new IORedis();

const requirePaymentSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  userBalance: z.bigint().positive().optional(),
});

export async function requirePaymentMiddleware(
  request: FastifyRequest<{
    Querystring: { address: string; userBalance?: bigint };
  }>,
  reply: FastifyReply
) {
  try {
    const { address } = request.query;
    const balanceKey = `balance:${address.toLowerCase()}`;

    // Verifica o saldo do usuário
    let userBalance = BigInt((await redis.get(balanceKey)) || 0);
    if (userBalance === null || BigInt(userBalance) < 1n) {
      reply.status(402).send(`Insufficient balance.`);
      return;
    }

    // Deduz 1 do saldo do usuário
    let newBalance = userBalance - 1n;
    await redis.set(balanceKey, newBalance.toString());

    // Validação do schema com Zod
    const result = requirePaymentSchema.safeParse({
      address,
      userBalance: newBalance,
    });
    if (!result.success) {
      reply.status(400).send({ error: "Invalid data" });
      return;
    }

    request.query.userBalance = newBalance; // Adiciona o saldo atualizado ao request para uso posterior
  } catch (error) {
    console.log(error);
    reply.status(500).send({
      error: "An error occurred while processing the payment requirement",
    });
  }
}
