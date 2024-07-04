import IORedis from "ioredis";
import supertest from "supertest";
import { server } from "../../src/server";
import { sendSomeValeToAddress } from "./utils/client";
import { envLoader } from "../../src/envLoader";
import { signMessage } from "viem/accounts";

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
    const txid = await sendSomeValeToAddress(
      10n ** 18n,
      envLoader.SERVER_ADDRESS
    );

    const message = `Add balance for txid ${txid}`;
    const address = envLoader.CLIENT_ADDRESS;

    const signature = await signMessage({
      message,
      privateKey: envLoader.CLIENT_PRIVATE_KEY,
    });

    const response = await supertest(server.server)
      .post("/add")
      .send({ message, signature, address, txid });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Balance updated",
      balance: (10n ** 18n).toString(),
    });
  });

  test("should return secret if balance is sufficient", async () => {
    await redis.set(`balance:${envLoader.CLIENT_ADDRESS.toLowerCase()}`, "10");

    const message = "Request secret";
    const address = envLoader.CLIENT_ADDRESS;
    const signature = await signMessage({
      message,
      privateKey: envLoader.CLIENT_PRIVATE_KEY,
    });

    const response = await supertest(server.server)
      .post("/secret")
      .send({ message, signature, address });

    expect(response.status).toBe(200);
    expect(response.text).toBe("secret!");

    const newBalance = await redis.get(
      `balance:${envLoader.CLIENT_ADDRESS.toLowerCase()}`
    );
    expect(newBalance).toBe("9");
  });

  test("should return 402 if balance is insufficient", async () => {
    await redis.set(`balance:${envLoader.CLIENT_ADDRESS.toLowerCase()}`, "0");

    const message = `Request secret`;
    const address = envLoader.CLIENT_ADDRESS;
    const signature = await signMessage({
      message: "Request secret",
      privateKey: envLoader.CLIENT_PRIVATE_KEY,
    });

    const response = await supertest(server.server)
      .post("/secret")
      .send({ message, signature, address });

    expect(response.status).toBe(402);
    expect(response.text).toBe("Insufficient balance.");
  });

  test("should return 400 if transaction already used", async () => {
    const txid = await sendSomeValeToAddress(
      10n ** 18n,
      envLoader.SERVER_ADDRESS
    );

    await redis.set(`txid:${txid}`, "used");
    const message = `Add balance for txid ${txid}`;
    const address = envLoader.CLIENT_ADDRESS;

    const signature = await signMessage({
      message,
      privateKey: envLoader.CLIENT_PRIVATE_KEY,
    });

    const response = await supertest(server.server)
      .post("/add")
      .send({ message, signature, address, txid });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Transaction already used" });
  });

  test("should return 402 if payment address is incorrect", async () => {
    const txid = await sendSomeValeToAddress(10n, envLoader.OTHER_ADDRESS);

    const message = `Add balance for txid ${txid}`;
    const address = envLoader.CLIENT_ADDRESS;
    const signature = await signMessage({
      privateKey: envLoader.CLIENT_PRIVATE_KEY,
      message,
    });

    const response = await supertest(server.server)
      .post("/add")
      .send({ message, signature, address, txid });

    expect(response.status).toBe(402);
    expect(response.text).toBe(
      `Payment required to address ${envLoader.SERVER_ADDRESS}`
    );
  });
});
