const fs = require('fs');
const util = require('util');
const path  = require('path');
const xml2js = require('xml2js');
const glob = require('glob');

const readFileAsync = util.promisify(fs.readFile);
const parser = new xml2js.Parser();
const parseStringAsync = util.promisify(parser.parseString);

const cwd = process.cwd();

export const DEFAULT_FIND_PATTERN = '**/*.{cshtml,cs}';
export const DEFAULT_FIND_IGNORE = '{node_modules,obj,bin}/**';

interface Result {
    includes: string[];
    duplicates: string[];
    missing: string[]
}

interface Attributes {
    Include: string;
}
interface Row {
    $: Attributes;
}

interface ItemGroup {
    Content: Row[];
    Compile: Row[];
}
interface Project {
    ItemGroup: ItemGroup[];
}
interface XmlData {
    Project: Project;
}

const collectIncludes = (xmlData: XmlData): string[] => {
    let includes: string[] = [];
    xmlData.Project.ItemGroup.forEach(itemGroup => {
        if(itemGroup.Content !== undefined) {
            let newIncludes = itemGroup.Content.map(c => c.$.Include);
            includes = includes.concat(newIncludes);
        }
        if(itemGroup.Compile !== undefined) {
            let newIncludes = itemGroup.Compile.map(c => c.$.Include);
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

const findMissingIncludes = async (entries: string[], findPattern: string, findIgnores: string): Promise<string[]> => {
    const globAsync = util.promisify(glob);
    const files: string[] = await globAsync(findPattern, {"ignore": findIgnores});
    let missingFiles: string[] = [];
    files.forEach(filePath => {
        const relativePath = filePath.replace(path.join(cwd, "/"),"").split(path.sep).join('\\');
        if (entries.indexOf(relativePath) === -1) {
            missingFiles.push(relativePath);
        }
    });
    return missingFiles;
};

const findStringLines = (data: string, searchKeyword: string) => {
    let dataArray = data.split('\n');
    let lines = [];

    for (let index=0; index<dataArray.length; index++) {
        if (dataArray[index].indexOf(searchKeyword) !== -1) {
            lines.push(index + 1);
        }
    }
    return lines;
};

const report = (res: Result, data: string): void => {
    if (res.duplicates.length > 0) {
        console.error(`${res.duplicates.length} duplicated includes found.`);
        res.duplicates.forEach(element => {
            var lines = findStringLines(data, element);
            console.error(`Duplicated include: "${element}", lines: ${lines.join(', ')}`);
        });
    } else {
        console.log(`No duplicated includes found.`);
    }
    if (res.missing.length > 0) {
        console.error(`${res.missing.length} missing includes found.`);
        res.missing.forEach(element => {
            console.log(`Missing file in csproj: "${element}"`);
        });
    } else {
        console.log(`No missing includes found.`);
    }
    if (res.duplicates.length > 0 || res.missing.length > 0) {
        process.exit(1);
    }
    console.log('All done');
}

export const csprojSanitizer = async ({filePath, findPattern, findIgnores}: {filePath: string, findPattern: string, findIgnores: string}) => {

    let data;
    let parsedData;
    let results: Result = {includes: [], duplicates: [], missing: []};

    findPattern = findPattern || DEFAULT_FIND_PATTERN;
    findIgnores = findIgnores || DEFAULT_FIND_IGNORE;

    try {
        data = await readFileAsync(path.join(cwd, filePath), {encoding: 'utf-8'});
    } catch(e) {
        throw new Error('Error while reading file: ' + e.message);
    }
    try {
        parsedData = await parseStringAsync(data);
    } catch(e) {
        throw new Error('Error parsing file: ' + e.message);
    }

    results.includes = collectIncludes(parsedData);
    results.duplicates = findDuplicates(results.includes);
    results.missing = await findMissingIncludes(results.includes, findPattern, findIgnores);

    report(results, data);
}
