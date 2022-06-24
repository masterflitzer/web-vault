import { Status } from "https://deno.land/x/oak@v10.4.0/mod.ts";
import getMessageCode from "./codes.ts";
import type { BodyJson } from "https://deno.land/x/oak@v10.4.0/mod.ts";
import type { JsonResponse, VaultEntryData, VaultEntries } from "./types.ts";

export const serializeCodeObject = (code: number) => JSON.stringify({ code });

export const deserializeCodeObject = (s: string) => JSON.parse(s).code;

export function getDirname(url: string) {
    let path = new URL(url).pathname;
    path = path.replace(/^[/]([A-Z]:)/, "$1");
    path = path.replace(/[/][^/]+$/, "");
    return path;
}

export function getJsonResponse(
    success: boolean,
    result: VaultEntries,
    message?: number
): JsonResponse {
    return {
        success,
        result,
        message: message != null ? getMessageCode(message) : null,
    };
}

export async function getVaultEntryDataFromBody(body: BodyJson) {
    const payload = await body.value;
    const values: VaultEntryData = {
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

export function onlyDiff(
    oldData: VaultEntryData,
    newData: VaultEntryData
): VaultEntryData {
    if (newData.name == null) newData.name = oldData.name;
    if (newData.username == null) newData.username = oldData.username;
    if (newData.password == null) newData.password = oldData.password;
    if (newData.uri == null) newData.uri = oldData.uri;
    return newData;
}
