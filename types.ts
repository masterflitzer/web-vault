export type VaultEntry = {
    uuid: string;
    name: string;
    username: string;
    password: string;
    uri: string[];
};

export type VaultEntryRest = {
    name: string;
    username: string;
    password: string;
    uri: string[];
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
