export type Vault = Map<string, VaultEntry>;

export type VaultEntry = {
    name: string | null;
    username: string | null;
    password: string | null;
    uri: string[] | null;
};

export type VaultEntries = Record<string, VaultEntry>;

export type MessageCode = {
    code: number;
    message: string;
};

export type JsonResponse = {
    success: boolean;
    result: VaultEntries | null;
    message: MessageCode | null;
};
