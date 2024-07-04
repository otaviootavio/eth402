export const addBalanceSchema = {
  body: {
    type: "object",
    properties: {
      txid: { type: "string" },
      address: { type: "string" },
      signature: { type: "string" },
      message: { type: "string" },
    },
    required: ["txid", "address", "signature", "message"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        balance: { type: "string" },
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    402: {
      type: "string",
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};
