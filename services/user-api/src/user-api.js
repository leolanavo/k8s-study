import "regenerator-runtime/runtime.js";

import Koa from "koa";
import KoaRouter from "koa-router";

const port = 3000;

const app = new Koa();

const router = KoaRouter();

router.get("/health-check", (ctx) => {
  ctx.res.statusCode = 200;
});

router.get("/messages", (ctx) => {
  ctx.body = "Message from users";
});

router.get("/", (ctx) => {
  ctx.body = "Hello World";
});

app.use(router.routes());

app.listen({ port }, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
