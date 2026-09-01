export type ParsedResponse = {
    opcode: number;
    status: number;
    payload: Buffer;
    error?: string;
};
export declare function parseResponse(report: Buffer): ParsedResponse;
//# sourceMappingURL=responses.d.ts.map