import { v5 as uuid5 } from "https://deno.land/std@0.144.0/uuid/mod.ts";

type VaultEntry = {
    uuid: string;
    name: string;
    username: string;
    password: string;
    uri: string[];
};

// UUID and rest of data
const data = new Map<
    string,
    {
        name: string;
        username: string;
        password: string;
        uri: string[];
    }
>();

const isValidUUID = (uuid: string) => uuid5.validate(uuid);

const getData = (uuid: string): VaultEntry => {
    if (!isValidUUID(uuid)) throw new Error("Invalid UUID!");
    const x = data.get(uuid);
    if (x == null)
        throw new Error("Couldn't find a VaultEntry with this UUID!");
    return { uuid, ...x };
};

const setData = (item: VaultEntry): void => {
    const { uuid, ...rest } = item;
    if (!isValidUUID(uuid)) throw new Error("Invalid UUID!");
    data.set(uuid, rest);
};

const delData = (uuid: string): void => {
    if (!isValidUUID(uuid)) throw new Error("Invalid UUID!");
    data.delete(uuid);
};

const readJson = async (filePath: string) => {
    const json = JSON.parse(await Deno.readTextFile(filePath)) as VaultEntry[];
    data.clear();
    json.forEach((x) => setData(x));
};

const writeJson = async (filePath: string) => {
    const json: VaultEntry[] = [];
    data.forEach((_value, key) => {
        const x: VaultEntry = getData(key);
        json.push(x);
    });
    await Deno.writeTextFile(filePath, JSON.stringify(json));
};

export { readJson, writeJson, getData, setData, delData };
