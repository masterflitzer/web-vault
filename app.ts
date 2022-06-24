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

const port = 8080;
data.setDataFilePath("./backend/data.json");

const dirname = getDirname(import.meta.url);

const router = new Router();

router.get("/api", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    try {
        const result = await data.read();
        ctx.response.body = getJsonResponse(true, { result });
        ctx.response.body = JSON.stringify(ctx.response.body, null, 2);
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        ctx.response.status = getStatusFromCode(code);
        ctx.response.body = getJsonResponse(false, {}, code);
    }
});

router.post("/api", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const body = ctx.request.body({
        type: "json",
    });
    const payload = await getVaultEntryFromBody(body);
    try {
        await data.create({
            name: payload.name,
            username: payload.username,
            password: payload.password,
            uri: payload.uri,
        });
        ctx.response.body = getJsonResponse(true, {});
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        ctx.response.status = getStatusFromCode(code);
        ctx.response.body = getJsonResponse(false, {}, code);
    }
});

router.put("/api", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const body = ctx.request.body({
        type: "json",
    });
    const { id, ...rest } = await getVaultEntryFromBody(body);
    try {
        await data.update(id, rest);
        ctx.response.body = getJsonResponse(true, {});
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        ctx.response.status = getStatusFromCode(code);
        ctx.response.body = getJsonResponse(false, {}, code);
    }
});

router.delete("/api", async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    const body = ctx.request.body({
        type: "json",
    });
    const payload = await body.value;
    try {
        await data.deleteEntry(payload.id);
        ctx.response.body = getJsonResponse(true, {});
    } catch (e) {
        console.error(e);
        const code = deserializeCodeObject(e.message);
        ctx.response.status = getStatusFromCode(code);
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

app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https" : "http";
    const host = hostname === "0.0.0.0" ? "localhost" : hostname ?? "localhost";
    console.info(`Listening on ${protocol}://${host}:${port}`);
});

await app.listen({ port });
