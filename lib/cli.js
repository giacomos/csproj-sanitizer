#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __importDefault(require("."));
var figlet_1 = __importDefault(require("figlet"));
var optimist_1 = __importDefault(require("optimist"));
var config_1 = require("./config");
var usage = figlet_1.default.textSync('csproj-sanitizer', { horizontalLayout: 'full' }) + "\n    \n\nUsage: csproj-sanitizer --filePath [path]";
if (require.main === module) {
    var cwd = process.cwd();
    optimist_1.default.usage(usage)
        .demand(['filePath'])
        .describe('filePath', 'Relative or Absolute path where the csproj file is located')
        .default('findPattern', config_1.DEFAULT_FIND_PATTERN)
        .default('findIgnores', config_1.DEFAULT_FIND_IGNORE)
        .default('rootDir', cwd)
        .string('filePath')
        .string('findPattern')
        .string('findIgnores');
    var argv = optimist_1.default.parse(process.argv);
    _1.default(argv);
}
