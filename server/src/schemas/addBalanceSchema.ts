export const addBalanceSchema = {
  querystring: {
    type: "object",
    properties: {
      txid: { type: "string" },
    },
    required: ["txid"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        balance: { type: "number" },
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
