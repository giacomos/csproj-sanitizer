import csprojSanitizer from '../src/csprojSanitizer';

describe('csprojSanitizer', (): void => {

    it('correctly find duplicates or missing ', async (): Promise<void> => {
        expect(function() {
            csprojSanitizer({filePath: './example.csproj'});
        }).not.toThrow();
    });
});
