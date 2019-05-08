#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var optimist_1 = __importDefault(require("optimist"));
var figlet = require("figlet");
var config_1 = require("./config");
var csprojSanitizer_1 = __importDefault(require("./csprojSanitizer"));
var usage = figlet.textSync('csproj-sanitizer', { horizontalLayout: 'full' }) + "\n    \n\nUsage: $0 --filePath [path]";
var argv = optimist_1.default.usage(usage)
    .demand(['filePath'])
    .describe('filePath', 'Relative or Absolute path where the csproj file is located')
    .default('findPattern', config_1.DEFAULT_FIND_PATTERN)
    .default('findIgnores', config_1.DEFAULT_FIND_IGNORE)
    .string('filePath')
    .string('findPattern')
    .string('findIgnores')
    .argv;
csprojSanitizer_1.default({
    filePath: argv.filePath,
    findPattern: argv.findPattern,
    findIgnores: argv.findIgnores
});
