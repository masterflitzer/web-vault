export type VaultEntryData = {
    name: string | null;
    username: string | null;
    password: string | null;
    uri: string[] | null;
};

export type VaultEntries = Record<string, VaultEntryData>;

export type JsonResponse = {
    success: boolean;
    result: Record<string, VaultEntryData>;
    message: MessageCode | null;
};

export type MessageCode = {
    code: number;
    message: string;
};
