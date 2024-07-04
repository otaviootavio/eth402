export const getAddressSchema = {
  response: {
    200: {
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
