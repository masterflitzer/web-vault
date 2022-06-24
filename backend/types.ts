export type VaultEntryData = {
    name: string | null;
    username: string | null;
    password: string | null;
    uri: string[] | null;
};

export type VaultEntries = Record<string, VaultEntryData>;

export type MessageCode = {
    code: number;
    message: string;
};

export type JsonResponse = {
    success: boolean;
    result: VaultEntries | null;
    message: MessageCode | null;
};
