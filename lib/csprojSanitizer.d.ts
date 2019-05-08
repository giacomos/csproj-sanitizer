export declare const DEFAULT_FIND_PATTERN = "**/*.{cshtml,cs}";
export declare const DEFAULT_FIND_IGNORE = "{node_modules,obj,bin}/**";
export declare const csprojSanitizer: ({ filePath, findPattern, findIgnores }: {
    filePath: string;
    findPattern: string;
    findIgnores: string;
}) => Promise<void>;
