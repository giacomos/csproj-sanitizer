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
var __1 = __importDefault(require(".."));
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var stdoutWrite = jest.spyOn(process.stdout, 'write');
var stderrWrite = jest.spyOn(process.stderr, 'write');
var rootDir = path_1.default.join(process.cwd(), 'src/test');
describe('cli', function () {
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            stdoutWrite.mock.calls = [];
            stderrWrite.mock.calls = [];
            return [2 /*return*/];
        });
    }); });
    it('correctly work with proper csproj', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.argv.push('--filePath', 'src/test/examples/correct.csproj');
                    return [4 /*yield*/, __1.default({
                            'filePath': 'src/test/examples/correct.csproj',
                            rootDir: rootDir
                        })];
                case 1:
                    _a.sent();
                    expect(stdoutWrite.mock.calls).toEqual([
                        [chalk_1.default.green('✓') + " No duplicated includes found.\n"],
                        [chalk_1.default.green('✓') + " No missing includes found.\n"]
                    ]);
                    expect(process.exitCode).toEqual(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('correctly work with csproj with duplicates', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.default({
                        'filePath': 'src/test/examples/duplicate.csproj',
                        rootDir: rootDir
                    })];
                case 1:
                    _a.sent();
                    expect(stdoutWrite.mock.calls).toEqual([
                        [chalk_1.default.green('✓') + " No missing includes found.\n"]
                    ]);
                    expect(stderrWrite.mock.calls).toEqual([
                        ["1 duplicated includes found.\n"],
                        [chalk_1.default.yellow('X') + " Duplicated include: \"src\\test\\examples\\test.cshtml\", lines: 5, 6\n"]
                    ]);
                    expect(process.exitCode).toEqual(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('correctly work with csproj with missing includes', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.default({
                        'filePath': 'src/test/examples/missing.csproj',
                        rootDir: rootDir
                    })];
                case 1:
                    _a.sent();
                    expect(stdoutWrite.mock.calls).toEqual([
                        [chalk_1.default.green('✓') + " No duplicated includes found.\n"],
                    ]);
                    expect(stderrWrite.mock.calls).toEqual([
                        [chalk_1.default.red('X') + " 1 missing includes found.\n"],
                        ["- Missing file in csproj: \"src\\test\\examples\\test.cshtml\"\n"]
                    ]);
                    expect(process.exitCode).toEqual(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('correctly fail if csproj is not found', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.default({
                        'filePath': 'src/test/examples/notFound.csproj',
                        rootDir: rootDir
                    })];
                case 1:
                    _a.sent();
                    expect(stderrWrite.mock.calls).toEqual([
                        ["ENOENT: no such file or directory, open '" + rootDir + "/examples/notFound.csproj'"],
                    ]);
                    expect(process.exitCode).toEqual(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
