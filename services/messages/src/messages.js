import "regenerator-runtime/runtime.js";

import Koa from "koa";
import KoaRouter from "koa-router";
import fetch from "node-fetch";
import { connect } from "node-nats-streaming";

const {
  BROKER_SERVICE_HOST,
  BROKER_SERVICE_PORT_CLIENT,
  USERS_API_SERVICE_HOST,
  USERS_API_SERVICE_PORT,
} = process.env;

console.log("Initializing Server...");

const NATS_URI = `nats://${BROKER_SERVICE_HOST}:${BROKER_SERVICE_PORT_CLIENT}`;
const USER_URI = `http://${USERS_API_SERVICE_HOST}:${USERS_API_SERVICE_PORT}`;

const stan = connect("broker-cluster", "messages-api", {
  url: NATS_URI,
});

const port = 3001;
const app = new Koa();
const router = KoaRouter();

stan.on("connect", () => {
  console.log("Connected to NATS");
  const replayAll = stan.subscriptionOptions().setDeliverAllAvailable();

  const sub = stan.subscribe("new-message", replayAll);
  sub.on("message", (msg) => {
    console.log(`got message: ${msg.getData()}`);
  });

  router.get("/", async (ctx) => {
    const res = await fetch(USER_URI + "/messages");
    console.log(res);
    ctx.body = await res.text();
  });

  router.get("/health-check", (ctx) => {
    ctx.res.statusCode = 200;
  });

  router.get("/new-message", async (ctx) => {
    stan.publish("new-message", `New Message ${Math.random()}`);
    ctx.body = "New message sent";
  });

  app.use(router.routes());

  app.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
});
