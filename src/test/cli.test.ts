import cli = require('..');

describe('cli', (): void => {

    it('correctly work with proper csproj', async (): Promise<void> => {
        const log = jest.spyOn(console, 'log');
        jest.spyOn(process, 'exit').mockImplementationOnce((): never => {
            throw new Error('process.exit() was called.')
        });
        process.argv.push('--filePath', 'src/test/examples/correct.csproj');
        log.mock.calls = [];
        await expect(cli.cli()).rejects.toThrow(new Error('process.exit() was called.'))
        expect(log.mock.calls).toEqual([
            ["No duplicated includes found."],
            ["No missing includes found."]
        ]);
        expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('correctly work with csproj with duplicates', async (): Promise<void> => {
        const log = jest.spyOn(console, 'log');
        const error = jest.spyOn(console, 'error');
        jest.spyOn(process, 'exit').mockImplementationOnce((): never => {
            throw new Error('process.exit() was called.')
        });
        process.argv[3] = 'src/test/examples/duplicate.csproj';
        log.mock.calls = [];
        error.mock.calls = [];
        await expect(cli.cli()).rejects.toThrow(new Error('process.exit() was called.'))
        expect(log.mock.calls).toEqual([
            ["No missing includes found."]
        ]);
        expect(error.mock.calls).toEqual([
            ["1 duplicated includes found."],
            ["Duplicated include: \"src\\test\\examples\\test.cshtml\", lines: 5, 6"]
        ]);

        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('correctly work with csproj with missing includes', async (): Promise<void> => {
        const log = jest.spyOn(console, 'log');
        const error = jest.spyOn(console, 'error');
        jest.spyOn(process, 'exit').mockImplementationOnce((): never => {
            throw new Error('process.exit() was called.')
        });
        process.argv[3] = 'src/test/examples/missing.csproj';
        log.mock.calls = [];
        error.mock.calls = [];
        await expect(cli.cli()).rejects.toThrow(new Error('process.exit() was called.'))
        expect(log.mock.calls).toEqual([
            ["No duplicated includes found."],
        ]);
        expect(error.mock.calls).toEqual([
            ["1 missing includes found."],
            ["Missing file in csproj: \"src\\test\\examples\\test.cshtml\""]
        ]);

        expect(process.exit).toHaveBeenCalledWith(1);
    });
});
