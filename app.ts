import {
    Application,
    Router,
    send,
} from "https://deno.land/x/oak@v10.4.0/mod.ts";
import {
    getDirname,
    getJsonResponse,
    getVaultEntryFromBody,
    getStatusFromCode,
    deserializeCodeObject,
} from "./backend/helper.ts";
import * as data from "./backend/data.ts";
import type { VaultEntry } from "./backend/types.ts";

const port = 8080;
data.setDataFilePath("./backend/data.json");

const dirname = getDirname(import.meta.url);

const router = new Router();

router.get("/api/reload", async (ctx) => {
    try {
        await data.reloadData();
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        ctx.response.status = getStatusFromCode(code);
        ctx.response.body = getJsonResponse(false, {}, code);
    }
});

router.get("/api/openapi", async (ctx) => {
    await send(ctx, "./backend/openapi.json");
});

router.get("/api/passwords", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    try {
        const result = await data.read();
        ctx.response.body = getJsonResponse(true, result);
        ctx.response.body = JSON.stringify(ctx.response.body, null, 2);
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        ctx.response.status = getStatusFromCode(code);
        ctx.response.body = getJsonResponse(false, {}, code);
    }
});

router.post("/api/passwords", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const body = ctx.request.body({
        type: "json",
    });
    const payload: VaultEntry = await getVaultEntryFromBody(body);
    try {
        const id = await data.create(payload);
        ctx.response.body = getJsonResponse(true, { id });
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        ctx.response.status = getStatusFromCode(code);
        ctx.response.body = getJsonResponse(false, {}, code);
    }
});

router.put("/api/passwords/:id", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const id = ctx.params.id;
    const body = ctx.request.body({
        type: "json",
    });
    const payload: VaultEntry = await getVaultEntryFromBody(body);
    try {
        await data.update(id, payload);
        ctx.response.body = getJsonResponse(true, {});
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        ctx.response.status = getStatusFromCode(code);
        ctx.response.body = getJsonResponse(false, {}, code);
    }
});

router.delete("/api/passwords/:id", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const id = ctx.params.id;
    try {
        await data.deleteEntry(id);
        ctx.response.body = getJsonResponse(true, {});
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        ctx.response.status = getStatusFromCode(code);
        ctx.response.body = getJsonResponse(false, {}, code);
    }
});

// deno-lint-ignore require-await
router.patch("/api/passwords/:id", async (ctx) => {
    ctx.response.body = getJsonResponse(false, {});
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

app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https" : "http";
    const host = hostname === "0.0.0.0" ? "localhost" : hostname ?? "localhost";
    console.info(`Listening on ${protocol}://${host}:${port}`);
});

await app.listen({ port });
