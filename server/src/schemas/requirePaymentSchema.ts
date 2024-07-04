import { z } from "zod";

export const requirePaymentSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  userBalance: z.bigint().positive().optional(),
});
