import { DEFAULT_FIND_PATTERN, DEFAULT_FIND_IGNORE } from "./config";

import fs from 'fs';
import util from 'util';
import path from 'path';
import glob from 'glob';
// @ts-ignore
import xml2js = require('xml2js');

const readFileAsync = util.promisify(fs.readFile);
const parser = new xml2js.Parser();
const parseStringAsync = util.promisify(parser.parseString);

const collectIncludes = (xmlData: XmlData): string[] => {
    let includes: string[] = [];
    // @ts-ignore
    if (xmlData.Project === undefined || !Array.isArray(xmlData.Project.ItemGroup)) {
        throw new Error('The file structure does not contain a Project and/or ItemGroup nodes');
    }
    xmlData.Project.ItemGroup.forEach((itemGroup): void => {
        if(itemGroup.Content !== undefined) {
            let newIncludes = itemGroup.Content.map((c): string => c.$.Include);
            includes = includes.concat(newIncludes);
        }
        if(itemGroup.Compile !== undefined) {
            let newIncludes = itemGroup.Compile.map((c): string => c.$.Include);
            includes = includes.concat(newIncludes);
        }
    });
    return includes;
};

const findDuplicates = (entries: string[]): string[] => {
    let sortedIncludes = entries.sort();
    var duplicates = [];
    for (var i = 0; i < sortedIncludes.length - 1; i++) {
        if (sortedIncludes[i + 1] === sortedIncludes[i]) {
            duplicates.push(sortedIncludes[i]);
        }
    }
    return duplicates;
};

const findMissingIncludes = async (entries: string[], findPattern: string, findIgnores: string, rootDir: string): Promise<string[]> => {
    const globAsync = util.promisify(glob);
    const files: string[] = await globAsync(path.join(rootDir, findPattern), {"ignore": findIgnores});
    let missingFiles: string[] = [];
    files.forEach((filePath): void => {
        const relativePath = filePath.replace(path.join(rootDir, "/"),"").split(path.sep).join('\\');
        if (entries.indexOf(relativePath) === -1) {
            missingFiles.push(relativePath);
        }
    });
    return missingFiles;
};

export const findStringLines = (data: string, searchKeyword: string): number[] => {
    let dataArray = data.split('\n');
    let lines = [];

    for (let index=0; index<dataArray.length; index++) {
        if (dataArray[index].indexOf(searchKeyword) !== -1) {
            lines.push(index + 1);
        }
    }
    return lines;
};

const csprojSanitizer = async ({filePath, findPattern, findIgnores, rootDir}: Params): Promise<Result> => {

    let parsedData;
    let results: Result = {data: "", includes: [], duplicates: [], missing: []};

    findPattern = findPattern || DEFAULT_FIND_PATTERN;
    findIgnores = findIgnores || DEFAULT_FIND_IGNORE;

    filePath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);

    results.data = await readFileAsync(filePath, {encoding: 'utf-8'});
    parsedData = await parseStringAsync(results.data);

    results.includes = collectIncludes(parsedData);

    results.duplicates = findDuplicates(results.includes);
    results.missing = await findMissingIncludes(results.includes, findPattern, findIgnores, rootDir);

    return results;
}
export default csprojSanitizer;
