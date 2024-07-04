export const secretSchema = {
  body: {
    type: "object",
    properties: {
      address: { type: "string" },
      signature: { type: "string" },
      message: { type: "string" },
    },
    required: ["address", "signature", "message"],
  },
  response: {
    200: {
      type: "string",
    },
    402: {
      type: "string",
    },
  },
};
