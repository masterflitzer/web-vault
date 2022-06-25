import { Status } from "https://deno.land/x/oak@v10.4.0/mod.ts";
import getMessageCode from "./codes.ts";
import type { BodyJson } from "https://deno.land/x/oak@v10.4.0/mod.ts";
import type { JsonResponse, VaultEntry, VaultEntries } from "./types.ts";

export const serializeCodeObject = (code: number) => JSON.stringify({ code });

export const deserializeCodeObject = (s: string) => JSON.parse(s).code;

export function getDirname(url: string) {
    let path = new URL(url).pathname;
    path = path.replace(/^[/]([A-Z]:)/, "$1");
    path = path.replace(/[/][^/]+$/, "");
    return path;
}

export function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
}

export function getTime() {
    const date = new Date();
    const hh = `0${date.getHours()}`.slice(-2);
    const mm = `0${date.getMinutes()}`.slice(-2);
    const ss = `0${date.getSeconds()}`.slice(-2);
    return `${hh}:${mm}:${ss}`;
}

export function getJsonResponse(
    success: boolean,
    result: VaultEntries | Record<string, string> | null,
    message?: number
): JsonResponse {
    return {
        success,
        result,
        message: message != null ? getMessageCode(message) : null,
    };
}

export async function getVaultEntryFromBody(body: BodyJson) {
    const payload = await body.value;
    const values: VaultEntry = {
        name: payload.name ?? null,
        username: payload.username ?? null,
        password: payload.password ?? null,
        uri: payload.uri ?? null,
    };
    return values;
}

export function getStatusFromCode(code: number) {
    let status: Status;
    switch (code) {
        case 101:
            status = Status.BadRequest;
            break;
        case 102:
            status = Status.NotFound;
            break;
        case 103:
            status = Status.Conflict;
            break;
        default:
            status = Status.InternalServerError;
            break;
    }
    return status;
}

export function onlyDiff(oldData: VaultEntry, newData: VaultEntry): VaultEntry {
    if (newData.name == null) newData.name = oldData.name;
    if (newData.username == null) newData.username = oldData.username;
    if (newData.password == null) newData.password = oldData.password;
    if (newData.uri == null) newData.uri = oldData.uri;
    return newData;
}
