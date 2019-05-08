import csprojSanitizer from '../csprojSanitizer';

describe('csprojSanitizer', (): void => {

    it('correctly find duplicates or missing ', async (): Promise<void> => {
        const res = await csprojSanitizer({filePath: './src/test/example.csproj'});
        expect(res == 0);
    });
});
