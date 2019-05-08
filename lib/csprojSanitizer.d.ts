export declare const findStringLines: (data: string, searchKeyword: string) => number[];
declare const csprojSanitizer: ({ filePath, findPattern, findIgnores, rootDir }: Params) => Promise<Result>;
export default csprojSanitizer;
