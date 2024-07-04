type AddRequestBody = {
  txid: `0x${string}`;
  address: `0x${string}`;
  signature: `0x${string}`;
  message: string;
  userBalance?: bigint;
};
