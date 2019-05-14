import csprojSanitizer from '../csprojSanitizer';
import path from 'path';

const rootDir = path.join(process.cwd(), 'src/test');

describe('csprojSanitizer', (): void => {

    it('correctly find duplicates or missing ', async (): Promise<void> => {
        const res = await csprojSanitizer({
            filePath: path.join('examples', 'correct.csproj'),
            rootDir
        });
        expect(res.duplicates.length === 0);
        expect(res.missing.length === 0);
    });

    it('correctly find duplicates', async (): Promise<void> => {
        const res = await csprojSanitizer({
            filePath: path.join('examples', 'duplicate.csproj'),
            rootDir
        });
        expect(res.duplicates.length !== 0);
        expect(res.missing.length === 0);
    });

    it('correctly find missing', async (): Promise<void> => {
        const res = await csprojSanitizer({
            filePath: path.join('examples', 'missing.csproj'),
            rootDir
        });
        expect(res.duplicates.length === 0);
        expect(res.missing.length !== 0);
    });

    it('to break when csproj file is not properly formatted as by csproj format', async (): Promise<void> => {
        await expect(csprojSanitizer({
            filePath: path.join('examples', 'missingProject.csproj'),
            rootDir
        })).rejects.toThrow(new Error(`The file structure does not contain a Project and/or ItemGroup nodes`));
    });

    it('to break when csproj is not found', async (): Promise<void> => {
        await expect(csprojSanitizer({
            filePath: path.join('examples', 'notFound.csproj'),
            rootDir
        })).rejects.toThrow(new Error(`ENOENT: no such file or directory, open '${rootDir}/examples/notFound.csproj'`));
    });

    it('to break when csproj has xml errors', async (): Promise<void> => {
        await expect(csprojSanitizer({
            filePath: path.join('examples', 'badFormat.csproj'),
            rootDir
        })).rejects.toThrow(new Error(`Unexpected close tag\nLine: 6\nColumn: 10\nChar: >`));
    });
});
