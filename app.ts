import {
    Application,
    Router,
    Status,
    send,
} from "https://deno.land/x/oak@v10.4.0/mod.ts";
import { v5 as uuid5 } from "https://deno.land/std@0.144.0/uuid/mod.ts";
import * as data from "./backend/data.ts";
import { getDirname } from "./helper.ts";

const port = 8080;
const dirname = getDirname();

const router = new Router();

router.get("/", async (ctx) => {
    try {
        await send(ctx, ctx.request.url.pathname, {
            root: `${dirname}/frontend`,
            index: "index.html",
        });
    } catch (e) {
        console.error(e);
    }
});

router.get("/api", (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = "Received a HTTP GET request";
});

router.post("/api", (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = "Received a HTTP POST request";
});

router.put("/api/:id", (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = "Received a HTTP PUT request";
});

router.delete("/api/:id", (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = "Received a HTTP DELETE request";
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
    ctx.response.status = Status.NotFound;
    await next();
});

app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https" : "http";
    const host = hostname === "0.0.0.0" ? "localhost" : hostname ?? "localhost";
    console.info(`Listening on ${protocol}://${host}:${port}`);
});

await app.listen({ port });

// ctx?.params?.id

// ctx.response.body = {
//     status: {
//         code: 404,
//         message: "Not Found",
//     },
// };
