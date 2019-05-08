# csproj-sanitizer

This mini package helps sanitize your csproj file from duplicates and missing includes.

## Usage

```bash
$ csproj-sanitizer                                                                                                                                                                                                                                                                                                   
Usage: csproj-sanitizer --filePath [path]

Options:
  --filePath     [required]
  --findPattern  [default: "**/*.{cshtml,cs}"]
  --findIgnores  [default: "{node_modules,obj,bin}/**"]

Missing required arguments: filePath
```

# Author
Giacomo Spettoli