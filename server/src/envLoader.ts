import * as dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define the template literal type for hex strings
type HexString = `0x${string}`;

// Create a custom Zod schema for hex strings
const hexStringSchema = z
  .string()
  .refine((val): val is HexString => /^0x[a-fA-F0-9]+$/.test(val), {
    message: "String must start with '0x' followed by hexadecimal characters",
  });

// Define the schema for environment variables using zod and the custom hex string schema
const envSchema = z.object({
  SERVER_ADDRESS: hexStringSchema.refine((val) => val.length === 42, {
    message:
      "Invalid SERVER_ADDRESS format, must be 42 characters including 0x",
  }),
  SERVER_PRIVATE_KEY: hexStringSchema.refine((val) => val.length === 66, {
    message:
      "Invalid SERVER_PRIVATE_KEY format, must be 66 characters including 0x",
  }),
});

// Validate the environment variables
const envValidationResult = envSchema.safeParse(process.env);

if (!envValidationResult.success) {
  console.error(
    "Environment variable validation failed",
    envValidationResult.error.format()
  );
  process.exit(1); // Exit the process with a failure code
}

// Extract the validated environment variables
export const envLoader = envValidationResult.data;
