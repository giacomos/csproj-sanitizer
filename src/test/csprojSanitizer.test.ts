import csprojSanitizer from '../csprojSanitizer';

describe('csprojSanitizer', (): void => {

    it('correctly find duplicates or missing ', async (): Promise<void> => {
        expect(function(): void {
            csprojSanitizer({filePath: './example.csproj'});
        }).not.toThrow();
    });
});
