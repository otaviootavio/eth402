import IORedis from "ioredis";
import supertest from "supertest";
import { server } from "../../src/server";
import { sendSomeValeToAddress } from "./utils/client";
import { envLoader } from "../../src/envLoader";

const redis = new IORedis();

beforeAll(async () => {
  await server.listen({ port: 3000 });
});

afterAll(async () => {
  await server.close();
  await redis.quit();
});

beforeEach(async () => {
  await redis.flushall();
});

describe("Test /add and /secret routes with real transactions", () => {
  test("should add balance and return updated balance with a real transaction", async () => {
    const txid = await sendSomeValeToAddress(10n, envLoader.SERVER_ADDRESS);

    const response = await supertest(server.server)
      .post("/add")
      .query({ txid });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Balance updated",
      balance: 10,
    });
  });

  test("should return secret if balance is sufficient", async () => {
    await redis.set(`balance:${envLoader.CLIENT_ADDRESS.toLowerCase()}`, "10");

    const response = await supertest(server.server)
      .get("/secret")
      .query({ address: `${envLoader.CLIENT_ADDRESS.toLowerCase()}` });

    expect(response.status).toBe(200);
    expect(response.text).toBe("secret!");

    const newBalance = await redis.get(
      `balance:${envLoader.CLIENT_ADDRESS.toLowerCase()}`
    );
    expect(newBalance).toBe("9");
  });

  test("should return 402 if balance is insufficient", async () => {
    await redis.set(`balance:${envLoader.CLIENT_ADDRESS.toLowerCase()}`, "0.5");

    const response = await supertest(server.server)
      .get("/secret")
      .query({ address: `${envLoader.CLIENT_ADDRESS.toLowerCase()}` });

    expect(response.status).toBe(402);
    expect(response.text).toBe("Insufficient balance.");
  });

  test("should return 400 if transaction already used", async () => {
    await redis.set(
      "txid:0x25ea3dd85c333377bd0944b457b59751277fdbace98553c21f90bb0786a36f98",
      "used"
    );

    const response = await supertest(server.server).post("/add").query({
      txid: "0x25ea3dd85c333377bd0944b457b59751277fdbace98553c21f90bb0786a36f98",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Transaction already used" });
  });

  test("should return 402 if payment address is incorrect", async () => {
    const txid = await sendSomeValeToAddress(10n, envLoader.OTHER_ADDRESS);

    const response = await supertest(server.server)
      .post("/add")
      .query({ txid });

    expect(response.status).toBe(402);
    expect(response.text).toBe(
      `Payment required to address ${envLoader.SERVER_ADDRESS}`
    );
  });
});
