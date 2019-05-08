#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var optimist_1 = __importDefault(require("optimist"));
var figlet = require("figlet");
var config_1 = require("./config");
var csprojSanitizer_1 = __importStar(require("./csprojSanitizer"));
var usage = figlet.textSync('csproj-sanitizer', { horizontalLayout: 'full' }) + "\n    \n\nUsage: $0 --filePath [path]";
var cwd = process.cwd();
var argv = optimist_1.default.usage(usage)
    .demand(['filePath'])
    .describe('filePath', 'Relative or Absolute path where the csproj file is located')
    .default('findPattern', config_1.DEFAULT_FIND_PATTERN)
    .default('findIgnores', config_1.DEFAULT_FIND_IGNORE)
    .default('rootDir', cwd)
    .string('filePath')
    .string('findPattern')
    .string('findIgnores')
    .argv;
var report = function (res) {
    if (res.duplicates.length > 0) {
        console.error(res.duplicates.length + " duplicated includes found.");
        res.duplicates.forEach(function (element) {
            var lines = csprojSanitizer_1.findStringLines(res.data, element);
            console.error("Duplicated include: \"" + element + "\", lines: " + lines.join(', '));
        });
    }
    else {
        console.log("No duplicated includes found.");
    }
    if (res.missing.length > 0) {
        console.error(res.missing.length + " missing includes found.");
        res.missing.forEach(function (element) {
            console.log("Missing file in csproj: \"" + element + "\"");
        });
    }
    else {
        console.log("No missing includes found.");
    }
    if (res.duplicates.length > 0 || res.missing.length > 0) {
        return 1;
    }
    return 0;
};
csprojSanitizer_1.default({
    filePath: argv.filePath,
    findPattern: argv.findPattern,
    findIgnores: argv.findIgnores,
    rootDir: cwd
})
    .then(function (result) {
    return report(result);
})
    .then(function (res) { return process.exit(res); });
