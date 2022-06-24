export type VaultEntry = {
    id: string | null;
    name: string | null;
    username: string | null;
    password: string | null;
    uri: string[] | null;
};

export type VaultEntryData = {
    name: string | null;
    username: string | null;
    password: string | null;
    uri: string[] | null;
};

export type JsonResponse = {
    success: boolean;
    result: Record<string, unknown>;
    message: MessageCode | null;
};

export type MessageCode = {
    code: number;
    message: string;
};
