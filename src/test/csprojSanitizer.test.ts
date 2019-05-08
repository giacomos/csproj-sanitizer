import csprojSanitizer from '../csprojSanitizer';

describe('csprojSanitizer', (): void => {

    it('correctly find duplicates or missing ', async (): Promise<void> => {
        const res = await csprojSanitizer({
            filePath: './src/test/examples/correct.csproj',
            rootDir: './src/test'
        });
        expect(res.duplicates.length === 0);
        expect(res.missing.length === 0);
    });

    it('correctly find duplicates', async (): Promise<void> => {
        const res = await csprojSanitizer({
            filePath: './src/test/examples/duplicate.csproj',
            rootDir: './src/test'
        });
        expect(res.duplicates.length !== 0);
        expect(res.missing.length === 0);
    });

    it('correctly find missing', async (): Promise<void> => {
        const res = await csprojSanitizer({
            filePath: './src/test/examples/missing.csproj',
            rootDir: './src/test'
        });
        expect(res.duplicates.length === 0);
        expect(res.missing.length !== 0);
    });
});
