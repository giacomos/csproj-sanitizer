import chalk from 'chalk';
import csprojSanitizer, { findStringLines } from './csprojSanitizer';

const cwd = process.cwd();

const report = (res: Result): void => {
    if (res.duplicates.length > 0) {
        process.stderr.write(`${res.duplicates.length} duplicated includes found.\n`);
        res.duplicates.forEach((element): void => {
            var lines = findStringLines(res.data, element);
            process.stderr.write(`${chalk.yellow('X')} Duplicated include: "${element}", lines: ${lines.join(', ')}\n`);
        });
    } else {
        process.stdout.write(`${chalk.green('✓')} No duplicated includes found.\n`);
    }
    if (res.missing.length > 0) {
        process.stderr.write(`${chalk.red('X')} ${res.missing.length} missing includes found.\n`);
        res.missing.forEach((element): void => {
            process.stderr.write(`- Missing file in csproj: "${element}"\n`);
        });
    } else {

        process.stdout.write(`${chalk.green('✓')} No missing includes found.\n`);
    }
};

const app = (argv: Params): Promise<void> => {

    return csprojSanitizer({
        filePath:argv.filePath,
        findPattern: argv.findPattern,
        findIgnores: argv.findIgnores,
        rootDir: argv.rootDir
    }).then((result): Result => {
        report(result);
        return result;
    }).then((res): void => {
        const exitCode = (res.duplicates.length > 0 || res.missing.length > 0) ? 1 : 0;
        process.exitCode = exitCode;
    }).catch((err): void => {
        process.stderr.write(err.message);
        process.exitCode = 1;
    });
};

export default app;
