import {
    NIL_UUID,
    isNil,
    v4 as uuid4,
    v5 as uuid5,
} from "https://deno.land/std@0.144.0/uuid/mod.ts";

export { NIL_UUID, isNil };

export enum UUID_NAMESPACE {
    DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    OID = "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
    X500 = "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
}

export const validateUUIDv4 = (id: string) => uuid4.validate(id);

export const validateUUIDv5 = (id: string) => uuid5.validate(id);

export const generateUUIDv4 = () => crypto.randomUUID();

export const generateUUIDv5 = (
    namespace: UUID_NAMESPACE,
    data: string | null
) =>
    uuid5.generate(
        namespace,
        data != null ? new TextEncoder().encode(data) : new Uint8Array()
    );
