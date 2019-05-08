#!/usr/bin/env node

import optimist from 'optimist';
import { csprojSanitizer, DEFAULT_FIND_IGNORE, DEFAULT_FIND_PATTERN } from './csprojSanitizer';
import figlet = require('figlet');

const usage = `${figlet.textSync('csproj-sanitizer', { horizontalLayout: 'full' })}
    \n\nUsage: $0 --filePath [path]`;

var argv = optimist.usage(usage)
    .demand(['filePath'])
    .default('findPattern', DEFAULT_FIND_PATTERN)
    .default('findIgnores', DEFAULT_FIND_IGNORE)
    .argv;

    csprojSanitizer({
        filePath:argv.filePath,
        findPattern: argv.findPattern,
        findIgnores: argv.findIgnores
    });