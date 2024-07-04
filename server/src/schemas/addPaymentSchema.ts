import { z } from "zod";

export const addPaymentSchema = z.object({
  txid: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  userBalance: z.bigint().optional(),
});
