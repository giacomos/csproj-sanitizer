import app from '..';
import chalk from 'chalk';
import path from 'path';

const stdoutWrite = jest.spyOn(process.stdout, 'write');
const stderrWrite = jest.spyOn(process.stderr, 'write');
const rootDir = path.join(process.cwd(), 'src/test');

describe('cli', (): void => {
    afterEach(async (): Promise<void> => {
        stdoutWrite.mock.calls = [];
        stderrWrite.mock.calls = [];
    });

    it('correctly work with proper csproj', async (): Promise<void> => {
        process.argv.push('--filePath', 'src/test/examples/correct.csproj');
        await app({
            'filePath': 'src/test/examples/correct.csproj',
            rootDir
        });
        expect(stdoutWrite.mock.calls).toEqual([
            [`${chalk.green('✓')} No duplicated includes found.\n`],
            [`${chalk.green('✓')} No missing includes found.\n`]
        ]);
        expect(process.exitCode).toEqual(0);
    });

    it('correctly work with csproj with duplicates', async (): Promise<void> => {
        await app({
            'filePath': 'src/test/examples/duplicate.csproj',
            rootDir
        });
        expect(stdoutWrite.mock.calls).toEqual([
            [`${chalk.green('✓')} No missing includes found.\n`]
        ]);
        expect(stderrWrite.mock.calls).toEqual([
            ["1 duplicated includes found.\n"],
            [`${chalk.yellow('X')} Duplicated include: "src\\test\\examples\\test.cshtml", lines: 5, 6\n`]
        ]);

        expect(process.exitCode).toEqual(1);
    });

    it('correctly work with csproj with missing includes', async (): Promise<void> => {
        await app({
            'filePath': 'src/test/examples/missing.csproj',
            rootDir
        });
        expect(stdoutWrite.mock.calls).toEqual([
            [`${chalk.green('✓')} No duplicated includes found.\n`],
        ]);
        expect(stderrWrite.mock.calls).toEqual([
            [`${chalk.red('X')} 1 missing includes found.\n`],
            ["- Missing file in csproj: \"src\\test\\examples\\test.cshtml\"\n"]
        ]);

        expect(process.exitCode).toEqual(1);
    });

    it('correctly fail if csproj is not found', async (): Promise<void> => {
        await app({
            'filePath': 'src/test/examples/notFound.csproj',
            rootDir
        });
        expect(stderrWrite.mock.calls).toEqual([
            [`ENOENT: no such file or directory, open '${rootDir}/examples/notFound.csproj'`],
        ]);

        expect(process.exitCode).toEqual(1);
    });
});
