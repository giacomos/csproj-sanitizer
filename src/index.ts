#!/usr/bin/env node

import optimist from 'optimist';
import figlet = require('figlet');
import { DEFAULT_FIND_IGNORE, DEFAULT_FIND_PATTERN } from './config';
import csprojSanitizer, { findStringLines } from './csprojSanitizer';

const usage = `${figlet.textSync('csproj-sanitizer', { horizontalLayout: 'full' })}
    \n\nUsage: csproj-sanitizer --filePath [path]`;

const cwd = process.cwd();

const report = (res: Result): void => {
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
            console.error(`Missing file in csproj: "${element}"`);
        });
    } else {
        console.log(`No missing includes found.`);
    }
}
export const cli = (): Promise<void> => {
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

    return csprojSanitizer({
        filePath:argv.filePath,
        findPattern: argv.findPattern,
        findIgnores: argv.findIgnores,
        rootDir: cwd
    }).then((result): Result => {
        report(result);
        return result;
    }).then((res): void=> {
        const exitCode = (res.duplicates.length > 0 || res.missing.length > 0) ? 1 : 0;
        process.exit(exitCode);
    });
}

if (require.main === module) {
    cli();
}
