import { z } from "zod";

export const requirePaymentSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  userBalance: z.bigint().positive().optional(),
});

export const addPaymentSchema = z.object({
  txid: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  userBalance: z.bigint().optional(),
});

export const addBalanceSchema = z.object({
  txid: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/),
  message: z.string(),
});

export const secretSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/),
  message: z.string(),
});
