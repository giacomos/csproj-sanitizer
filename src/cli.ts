#!/usr/bin/env node
import app from ".";
import figlet from 'figlet';
import optimist from "optimist";
import { DEFAULT_FIND_PATTERN, DEFAULT_FIND_IGNORE } from "./config";

const usage = `${figlet.textSync('csproj-sanitizer', { horizontalLayout: 'full' })}
    \n\nUsage: csproj-sanitizer --filePath [path]`;

if (require.main === module) {
    const cwd = process.cwd();
    optimist.usage(usage)
        .demand(['filePath'])
        .describe('filePath', 'Relative or Absolute path where the csproj file is located')
        .default('findPattern', DEFAULT_FIND_PATTERN)
        .default('findIgnores', DEFAULT_FIND_IGNORE)
        .default('rootDir', cwd)
        .string('filePath')
        .string('findPattern')
        .string('findIgnores');
    var argv = optimist.parse(process.argv);
    app(argv);
}
