export type SecretRequestBody = {
  address: `0x${string}`;
  signature: `0x${string}`;
  message: string;
  userBalance?: bigint;
};
