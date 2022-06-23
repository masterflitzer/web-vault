import type { VaultEntry, VaultEntryRest } from "../types.ts";
import { isValidUUID, serializeCodeObject } from "./helper.ts";

let dataFilePath: string;
export const setDataFilePath = (s: string) => (dataFilePath = s);
export const getDataFilePath = () => dataFilePath;

const data = new Map<string, VaultEntryRest>();

export async function readItems(): Promise<VaultEntry[]> {
    await readJson();
    const result: VaultEntry[] = [];
    data.forEach((value, key) => {
        result.push({ uuid: key, ...value });
    });
    return result;
}

export async function readItem(uuid: string): Promise<VaultEntry> {
    if (!isValidUUID(uuid)) throw new Error(serializeCodeObject(101));
    if (!data.has(uuid)) throw new Error(serializeCodeObject(102));
    await readJson();
    const rest = data.get(uuid) as VaultEntryRest;
    return { uuid, ...rest };
}

export async function createItem(item: VaultEntry) {
    const { uuid, ...rest } = item;
    if (!isValidUUID(uuid)) throw new Error(serializeCodeObject(101));
    if (data.has(uuid)) throw new Error(serializeCodeObject(103));
    await readJson();
    data.set(uuid, rest);
    await writeJson();
}

export async function updateItem(item: VaultEntry) {
    const { uuid, ...rest } = item;
    if (!isValidUUID(uuid)) throw new Error(serializeCodeObject(101));
    if (!data.has(uuid)) throw new Error(serializeCodeObject(102));
    await readJson();
    data.set(uuid, rest);
    await writeJson();
}

export async function deleteItem(uuid: string) {
    if (!isValidUUID(uuid)) throw new Error(serializeCodeObject(101));
    await readJson();
    data.delete(uuid);
    await writeJson();
}

async function readJson() {
    try {
        const text = await Deno.readTextFile(dataFilePath);
        const json = JSON.parse(text) as VaultEntry[];
        data.clear();
        json.forEach((item) => {
            const { uuid, ...rest } = item;
            data.set(uuid, rest);
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
            json.push({ uuid: key, ...value });
        });
        await Deno.writeTextFile(dataFilePath, JSON.stringify(json));
    } catch (e) {
        console.error(e);
        throw new Error(serializeCodeObject(105));
    }
}
