import {
    Application,
    Router,
    Status,
    send,
} from "https://deno.land/x/oak@v10.4.0/mod.ts";
import {
    getDirname,
    getJsonResponse,
    deserializeCodeObject,
    generateUUIDv5,
    UUID_NAMESPACE,
} from "./backend/helper.ts";
import * as data from "./backend/data.ts";

const port = 8080;
data.setDataFilePath("./backend/data.json");

const dirname = getDirname(import.meta.url);

const router = new Router();

// deno-lint-ignore require-await
router.get("/api", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const msg = "Received a HTTP GET request";
    ctx.response.body = {};
    ctx.response.body = JSON.stringify(
        {
            status: {
                code: ctx.response.status,
                message: msg,
            },
        },
        null,
        2
    );
});

// deno-lint-ignore require-await
router.post("/api", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const msg = "Received a HTTP POST request";
    ctx.response.body = {};
    ctx.response.body = {
        status: {
            code: ctx.response.status,
            message: msg,
        },
    };
});

// deno-lint-ignore require-await
router.put("/api/:id", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const msg = "Received a HTTP PUT request";
    ctx.response.body = {};
    ctx.response.body = {
        status: {
            code: ctx.response.status,
            message: msg,
        },
    };
});

router.delete("/api/:id", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const id = ctx.params.id;
    try {
        await data.deleteItem(id);
        ctx.response.body = getJsonResponse(true, {});
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        switch (code) {
            case 101:
                ctx.response.status = Status.BadRequest;
                break;
            case 102:
                ctx.response.status = Status.NotFound;
                break;
            default:
                ctx.response.status = Status.InternalServerError;
                break;
        }
        ctx.response.body = getJsonResponse(false, {}, code);
    }
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
    try {
        await send(ctx, ctx.request.url.pathname, {
            root: `${dirname}/frontend`,
            index: "index.html",
        });
    } catch (e) {
        console.error(e);
    } finally {
        await next();
    }
});

const uuid1 = await generateUUIDv5(UUID_NAMESPACE.UUID_NAMESPACE_OID, "test1");
const uuid2 = await generateUUIDv5(UUID_NAMESPACE.UUID_NAMESPACE_OID, "test2");

app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https" : "http";
    const host = hostname === "0.0.0.0" ? "localhost" : hostname ?? "localhost";
    console.info(`Listening on ${protocol}://${host}:${port}`);
});

await app.listen({ port });
