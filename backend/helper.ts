import { v5 as uuid5 } from "https://deno.land/std@0.144.0/uuid/mod.ts";
import type { JsonResponse } from "../types.ts";
import getMessageCode from "./codes.ts";

export enum UUID_NAMESPACE {
    UUID_NAMESPACE_DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    UUID_NAMESPACE_URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    UUID_NAMESPACE_OID = "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
    UUID_NAMESPACE_X500 = "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
}

export const generateUUIDv4 = () => crypto.randomUUID();

export const generateUUIDv5 = (namespace: UUID_NAMESPACE, data: string) =>
    uuid5.generate(namespace, new TextEncoder().encode(data));

export const isValidUUID = (uuid: string) => uuid5.validate(uuid);

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
    result: Record<string, unknown>,
    message?: number
): JsonResponse {
    return {
        success,
        result,
        message: message != null ? getMessageCode(message) : null,
    };
}
