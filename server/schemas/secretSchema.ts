export const secretSchema = {
  querystring: {
    type: "object",
    properties: {
      address: { type: "string" },
    },
    required: ["address"],
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
