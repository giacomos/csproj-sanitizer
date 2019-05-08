"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var path_1 = __importDefault(require("path"));
var glob_1 = __importDefault(require("glob"));
// @ts-ignore
var xml2js = require("xml2js");
var readFileAsync = util_1.default.promisify(fs_1.default.readFile);
var parser = new xml2js.Parser();
var parseStringAsync = util_1.default.promisify(parser.parseString);
var cwd = process.cwd();
var collectIncludes = function (xmlData) {
    var includes = [];
    xmlData.Project.ItemGroup.forEach(function (itemGroup) {
        if (itemGroup.Content !== undefined) {
            var newIncludes = itemGroup.Content.map(function (c) { return c.$.Include; });
            includes = includes.concat(newIncludes);
        }
        if (itemGroup.Compile !== undefined) {
            var newIncludes = itemGroup.Compile.map(function (c) { return c.$.Include; });
            includes = includes.concat(newIncludes);
        }
    });
    return includes;
};
var findDuplicates = function (entries) {
    var sortedIncludes = entries.sort();
    var duplicates = [];
    for (var i = 0; i < sortedIncludes.length - 1; i++) {
        if (sortedIncludes[i + 1] === sortedIncludes[i]) {
            duplicates.push(sortedIncludes[i]);
        }
    }
    return duplicates;
};
var findMissingIncludes = function (entries, findPattern, findIgnores) { return __awaiter(_this, void 0, void 0, function () {
    var globAsync, files, missingFiles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                globAsync = util_1.default.promisify(glob_1.default);
                return [4 /*yield*/, globAsync(findPattern, { "ignore": findIgnores })];
            case 1:
                files = _a.sent();
                missingFiles = [];
                files.forEach(function (filePath) {
                    var relativePath = filePath.replace(path_1.default.join(cwd, "/"), "").split(path_1.default.sep).join('\\');
                    if (entries.indexOf(relativePath) === -1) {
                        missingFiles.push(relativePath);
                    }
                });
                return [2 /*return*/, missingFiles];
        }
    });
}); };
var findStringLines = function (data, searchKeyword) {
    var dataArray = data.split('\n');
    var lines = [];
    for (var index = 0; index < dataArray.length; index++) {
        if (dataArray[index].indexOf(searchKeyword) !== -1) {
            lines.push(index + 1);
        }
    }
    return lines;
};
var report = function (res, data) {
    if (res.duplicates.length > 0) {
        console.error(res.duplicates.length + " duplicated includes found.");
        res.duplicates.forEach(function (element) {
            var lines = findStringLines(data, element);
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
var csprojSanitizer = function (_a) {
    var filePath = _a.filePath, findPattern = _a.findPattern, findIgnores = _a.findIgnores;
    return __awaiter(_this, void 0, void 0, function () {
        var data, parsedData, results, e_1, e_2, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    results = { includes: [], duplicates: [], missing: [] };
                    findPattern = findPattern || config_1.DEFAULT_FIND_PATTERN;
                    findIgnores = findIgnores || config_1.DEFAULT_FIND_IGNORE;
                    filePath = path_1.default.isAbsolute(filePath) ? filePath : path_1.default.join(cwd, filePath);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readFileAsync(filePath, { encoding: 'utf-8' })];
                case 2:
                    data = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    throw new Error('Error while reading file: ' + e_1.message);
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, parseStringAsync(data)];
                case 5:
                    parsedData = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _c.sent();
                    throw new Error('Error parsing file: ' + e_2.message);
                case 7:
                    try {
                        results.includes = collectIncludes(parsedData);
                    }
                    catch (e) {
                        throw new Error('Error while collecting includes: ' + e.message);
                    }
                    results.duplicates = findDuplicates(results.includes);
                    _b = results;
                    return [4 /*yield*/, findMissingIncludes(results.includes, findPattern, findIgnores)];
                case 8:
                    _b.missing = _c.sent();
                    return [2 /*return*/, report(results, data)];
            }
        });
    });
};
exports.default = csprojSanitizer;
