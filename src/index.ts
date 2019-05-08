#!/usr/bin/env node

import optimist from 'optimist';
import figlet = require('figlet');
import { DEFAULT_FIND_IGNORE, DEFAULT_FIND_PATTERN } from './config';
import csprojSanitizer, { findStringLines } from './csprojSanitizer';

const usage = `${figlet.textSync('csproj-sanitizer', { horizontalLayout: 'full' })}
    \n\nUsage: $0 --filePath [path]`;

const cwd = process.cwd();

var argv = optimist.usage(usage)
    .demand(['filePath'])
    .describe('filePath', 'Relative or Absolute path where the csproj file is located')
    .default('findPattern', DEFAULT_FIND_PATTERN)
    .default('findIgnores', DEFAULT_FIND_IGNORE)
    .default('rootDir', cwd)
    .string('filePath')
    .string('findPattern')
    .string('findIgnores')
    .argv;

const report = (res: Result): number => {
    if (res.duplicates.length > 0) {
        console.error(`${res.duplicates.length} duplicated includes found.`);
        res.duplicates.forEach((element): void => {
            var lines = findStringLines(res.data, element);
            console.error(`Duplicated include: "${element}", lines: ${lines.join(', ')}`);
        });
    } else {
        console.log(`No duplicated includes found.`);
    }
    if (res.missing.length > 0) {
        console.error(`${res.missing.length} missing includes found.`);
        res.missing.forEach((element): void => {
            console.log(`Missing file in csproj: "${element}"`);
        });
    } else {
        console.log(`No missing includes found.`);
    }
    if (res.duplicates.length > 0 || res.missing.length > 0) {
        return 1
    }
    return 0;
}

csprojSanitizer({
    filePath:argv.filePath,
    findPattern: argv.findPattern,
    findIgnores: argv.findIgnores,
    rootDir: cwd
})
    .then((result): number => {
        return report(result);
    })
    .then((res): void=> process.exit(res));
