import type { Vault, VaultEntry, VaultEntries } from "./types.ts";
import { serializeCodeObject, onlyDiff } from "./helper.ts";
import {
    generateUUIDv5,
    validateUUIDv5,
    isNil,
    UUID_NAMESPACE,
} from "./uuid.ts";

let dataFilePath: string;
export const setDataFilePath = (s: string) => (dataFilePath = s);
export const getDataFilePath = () => dataFilePath;

const data: Vault = new Map<string, VaultEntry>();

export async function create(values: VaultEntry) {
    let id = await generateUUIDv5(UUID_NAMESPACE.OID, values.name);
    let counter = 0;
    while (counter < 10 && !isNil(id) && !validateUUIDv5(id) && data.has(id)) {
        id = await generateUUIDv5(UUID_NAMESPACE.OID, null);
        counter++;
    }
    if (!validateUUIDv5(id)) throw new Error(serializeCodeObject(101));
    if (data.has(id)) throw new Error(serializeCodeObject(103));
    await readJson();
    data.set(id, values);
    await writeJson();
}

export async function read() {
    await readJson();
    const result: VaultEntries = {};
    data.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

export async function update(id: string | null, values: VaultEntry) {
    if (id == null || !validateUUIDv5(id))
        throw new Error(serializeCodeObject(101));
    if (!data.has(id)) throw new Error(serializeCodeObject(102));
    await readJson();
    const old = data.get(id) ?? {
        name: null,
        username: null,
        password: null,
        uri: null,
    };
    values = onlyDiff(old, values);
    data.set(id, values);
    await writeJson();
}

export async function deleteEntry(id: string | null) {
    if (id == null || !validateUUIDv5(id))
        throw new Error(serializeCodeObject(101));
    if (!data.has(id)) throw new Error(serializeCodeObject(102));
    await readJson();
    data.delete(id);
    await writeJson();
}

async function readJson() {
    try {
        const text = await Deno.readTextFile(dataFilePath);
        const json = JSON.parse(text);
        const dataMap: Vault = new Map(Object.entries(json));
        data.clear();
        dataMap.forEach((value, key) => {
            data.set(key, value);
        });
    } catch (e) {
        console.error(e);
        throw new Error(serializeCodeObject(104));
    }
}

async function writeJson() {
    try {
        const dataObject: VaultEntries = Object.fromEntries(data.entries());
        await Deno.writeTextFile(
            dataFilePath,
            JSON.stringify(dataObject, null, 2)
        );
    } catch (e) {
        console.error(e);
        throw new Error(serializeCodeObject(105));
    }
}
