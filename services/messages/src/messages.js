import "regenerator-runtime/runtime.js";

import Koa from "koa";
import KoaRouter from "koa-router";
import fetch from "node-fetch";

const userURI = `http://${process.env.USERS_API_SERVICE_HOST}:${process.env.USERS_API_SERVICE_PORT}`;
const port = 3001;

const app = new Koa();

const router = KoaRouter();

router.get("/health-check", (ctx) => {
  ctx.res.statusCode = 200;
});

router.get("/", async (ctx) => {
  const res = await fetch(userURI + "/messages");
  console.log(res);
  ctx.body = await res.text();
});

app.use(router.routes());

app.listen({ port }, () => {
  console.log(userURI);
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
