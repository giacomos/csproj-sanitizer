import { DEFAULT_FIND_PATTERN, DEFAULT_FIND_IGNORE } from "./config";

import fs from 'fs';
import util from 'util';
import path from 'path';
import globby from 'globby';
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
        let contents = itemGroup.Content !== undefined ? itemGroup.Content.map((c): string => c.$.Include) : [];
        let compiles = itemGroup.Compile !== undefined ? itemGroup.Compile.map((c): string => c.$.Include) : [];
        includes = includes.concat(contents, compiles);
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

const findMissingIncludes = async (entries: string[], findPattern: string, findIgnores: string|string[], rootDir: string): Promise<string[]> => {
    let globbyFindPattern = [path.join(rootDir, findPattern)];
    if (findIgnores !== undefined && findIgnores !== "") {
        globbyFindPattern = Array.isArray(findIgnores) ? globbyFindPattern.concat(findIgnores) : globbyFindPattern.concat([findIgnores]);
    }
    const files: string[] = await globby(globbyFindPattern, {
        gitignore: true
    });
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

    let filePathAbsolute = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
    results.data = await readFileAsync(filePathAbsolute, {encoding: 'utf-8'});
    parsedData = await parseStringAsync(results.data);

    results.includes = collectIncludes(parsedData);

    results.duplicates = findDuplicates(results.includes);
    let csprojDir = filePathAbsolute.split(path.sep).slice(0, -1).join(path.sep);
    results.missing = await findMissingIncludes(results.includes, findPattern, findIgnores, csprojDir);

    return results;
}
export default csprojSanitizer;
