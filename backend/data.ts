import type { VaultEntry, VaultEntryData } from "./types.ts";
import { serializeCodeObject, onlyDiff } from "./helper.ts";
import * as uuid from "./uuid.ts";

let dataFilePath: string;
export const setDataFilePath = (s: string) => (dataFilePath = s);
export const getDataFilePath = () => dataFilePath;

const data = new Map<string, VaultEntryData>();

export async function create(values: VaultEntryData) {
    let id = await uuid.generateUUIDv5(uuid.UUID_NAMESPACE.OID, values.name);
    let counter = 0;
    while (
        counter < 10 &&
        !uuid.isNil(id) &&
        !uuid.isValid5(id) &&
        data.has(id)
    ) {
        id = await uuid.generateUUIDv5(uuid.UUID_NAMESPACE.OID, null);
        counter++;
    }
    if (!uuid.isValid5(id)) throw new Error(serializeCodeObject(101));
    if (data.has(id)) throw new Error(serializeCodeObject(103));
    await readJson();
    data.set(id, values);
    await writeJson();
}

export async function read(): Promise<VaultEntry[]> {
    await readJson();
    const result: VaultEntry[] = [];
    data.forEach((value, key) => {
        result.push({ id: key, ...value });
    });
    return result;
}

export async function update(id: string | null, values: VaultEntryData) {
    if (id == null || !uuid.isValid5(id))
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
    if (id == null || !uuid.isValid5(id))
        throw new Error(serializeCodeObject(101));
    if (!data.has(id)) throw new Error(serializeCodeObject(102));
    await readJson();
    data.delete(id);
    await writeJson();
}

async function readJson() {
    try {
        const text = await Deno.readTextFile(dataFilePath);
        const json = JSON.parse(text) as VaultEntry[];
        data.clear();
        json.forEach((item) => {
            const { id, ...rest } = item;
            if (id != null) {
                data.set(id, rest);
            }
        });
    } catch (e) {
        console.error(e);
        throw new Error(serializeCodeObject(104));
    }
}

async function writeJson() {
    try {
        const json: VaultEntry[] = [];
        data.forEach((value, key) => {
            json.push({ id: key, ...value });
        });
        await Deno.writeTextFile(dataFilePath, JSON.stringify(json, null, 2));
    } catch (e) {
        console.error(e);
        throw new Error(serializeCodeObject(105));
    }
}
