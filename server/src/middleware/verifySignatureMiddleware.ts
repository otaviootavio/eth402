import { FastifyRequest, FastifyReply } from "fastify";
import { verifyMessage } from "viem";
import { z } from "zod";

const hexStringSchema = z
  .string()
  .refine((val): val is `0x${string}` => /^0x[a-fA-F0-9]+$/.test(val));

const signatureSchema = z.object({
  address: hexStringSchema,
  signature: hexStringSchema,
  message: z.string().min(1, "Message is required"),
});

export async function verifySignatureMiddleware(
  request: FastifyRequest<{ Body: AddRequestBody | SecretRequestBody }>,
  reply: FastifyReply
) {
  try {
    const validation = signatureSchema.safeParse(request.body);
    if (!validation.success) {
      reply.status(400).send({ error: validation.error.errors });
      return;
    }

    const { signature, message, address } = validation.data;

    const isValid = verifyMessage({ message, signature, address });
    if (!isValid) {
      reply.status(400).send({ error: "Invalid signature" });
      return;
    }

    request.body.address = address; // Attach the verified address to the request
  } catch (error) {
    reply.status(400).send({ error: "Invalid signature" });
  }
}
