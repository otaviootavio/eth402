import { FastifyRequest, FastifyReply } from "fastify";
import IORedis from "ioredis";
import { requirePaymentSchema } from "../schemas/requirePaymentSchema";

const redis = new IORedis();

export async function requirePaymentMiddleware(
  request: FastifyRequest<{ Body: SecretRequestBody }>,
  reply: FastifyReply
) {
  try {
    const { address } = request.body;
    const balanceKey = `balance:${address.toLowerCase()}`;

    // Verifica o saldo do usuário
    let userBalance = BigInt((await redis.get(balanceKey)) || 0);
    if (userBalance === null || userBalance < 1n) {
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
      console.log(result.error);
      reply.status(400).send({ error: "Invalid data" });
      return;
    }

    request.body.userBalance = newBalance; // Adiciona o saldo atualizado ao request para uso posterior
  } catch (error) {
    console.log(error);
    reply.status(500).send({
      error: "An error occurred while processing the payment requirement",
    });
  }
}
