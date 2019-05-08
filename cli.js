#!/usr/bin/env node

const optimist = require('optimist');
const csprojSanitizer = require('.');

var argv = optimist.usage('Usage: $0 --filePath [path]')
    .demand(['filePath'])
    .default('findPattern', csprojSanitizer.DEFAULT_FIND_PATTERN)
    .default('findIgnores', csprojSanitizer.DEFAULT_FIND_IGNORE)
    .argv;

    csprojSanitizer.csprojSanitizer({
        filePath:argv.filePath,
        findPattern: argv.findPattern,
        findIgnores: argv.findIgnores
    });