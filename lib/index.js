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
var chalk_1 = __importDefault(require("chalk"));
var csprojSanitizer_1 = __importStar(require("./csprojSanitizer"));
var cwd = process.cwd();
var report = function (res) {
    if (res.duplicates.length > 0) {
        process.stderr.write(res.duplicates.length + " duplicated includes found.\n");
        res.duplicates.forEach(function (element) {
            var lines = csprojSanitizer_1.findStringLines(res.data, element);
            process.stderr.write(chalk_1.default.yellow('X') + " Duplicated include: \"" + element + "\", lines: " + lines.join(', ') + "\n");
        });
    }
    else {
        process.stdout.write(chalk_1.default.green('✓') + " No duplicated includes found.\n");
    }
    if (res.missing.length > 0) {
        process.stderr.write(chalk_1.default.red('X') + " " + res.missing.length + " missing includes found.\n");
        res.missing.forEach(function (element) {
            process.stderr.write("- Missing file in csproj: \"" + element + "\"\n");
        });
    }
    else {
        process.stdout.write(chalk_1.default.green('✓') + " No missing includes found.\n");
    }
};
var app = function (argv) {
    return csprojSanitizer_1.default({
        filePath: argv.filePath,
        findPattern: argv.findPattern,
        findIgnores: argv.findIgnores,
        rootDir: cwd
    }).then(function (result) {
        report(result);
        return result;
    }).then(function (res) {
        var exitCode = (res.duplicates.length > 0 || res.missing.length > 0) ? 1 : 0;
        process.exitCode = exitCode;
    }).catch(function (err) {
        process.stderr.write(err.message);
        process.exitCode = 1;
    });
};
exports.default = app;
