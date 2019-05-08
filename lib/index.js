#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var optimist_1 = __importDefault(require("optimist"));
var csprojSanitizer_1 = require("./csprojSanitizer");
var figlet = require("figlet");
var usage = figlet.textSync('csproj-sanitizer', { horizontalLayout: 'full' }) + "\n    \n\nUsage: $0 --filePath [path]";
var argv = optimist_1.default.usage(usage)
    .demand(['filePath'])
    .default('findPattern', csprojSanitizer_1.DEFAULT_FIND_PATTERN)
    .default('findIgnores', csprojSanitizer_1.DEFAULT_FIND_IGNORE)
    .argv;
csprojSanitizer_1.csprojSanitizer({
    filePath: argv.filePath,
    findPattern: argv.findPattern,
    findIgnores: argv.findIgnores
});
