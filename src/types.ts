interface Result {
    includes: string[];
    duplicates: string[];
    missing: string[];
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

interface Params {
    filePath: string;
    findPattern: string;
    findIgnores: string;
}
