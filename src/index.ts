#!/usr/bin/env node

import optimist from 'optimist';
import figlet = require('figlet');
import { DEFAULT_FIND_IGNORE, DEFAULT_FIND_PATTERN } from './config';
import csprojSanitizer from './csprojSanitizer';

const usage = `${figlet.textSync('csproj-sanitizer', { horizontalLayout: 'full' })}
    \n\nUsage: $0 --filePath [path]`;

var argv = optimist.usage(usage)
    .demand(['filePath'])
    .describe('filePath', 'Relative path where the csproj file is located')
    .default('findPattern', DEFAULT_FIND_PATTERN)
    .default('findIgnores', DEFAULT_FIND_IGNORE)
    .string('filePath')
    .string('findPattern')
    .string('findIgnores')
    .argv;

csprojSanitizer({
    filePath:argv.filePath,
    findPattern: argv.findPattern,
    findIgnores: argv.findIgnores
});
