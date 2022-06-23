import type { MessageCode } from "../types.ts";

const codes = new Map<number, string>();

function getMessageCode(code: number): MessageCode {
    if (codes.has(code)) {
        return {
            code,
            message: codes.get(code) as string,
        };
    } else throw new Error("Invalid message code!");
}

codes.set(100, "Unknown error");
codes.set(101, "Invalid UUID");
codes.set(102, "UUID does not exist");
codes.set(103, "UUID does already exist");
codes.set(104, "Could not read from data file");
codes.set(105, "Could not write to data file");

export default getMessageCode;
