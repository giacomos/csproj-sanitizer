# csproj-sanitizer

[![CodeClimate](https://raw.githubusercontent.com/giacomos/csproj-sanitizer/master/badges/badge-statements.svg)](https://github.com/giacomos/csproj-sanitizer)

This mini package helps sanitize your csproj file from duplicates and missing includes.

## Usage

```bash
$ csproj-sanitizer                                                                                                                                                                                  _                                 _   _     _
   ___   ___   _ __    _ __    ___     (_)          ___    __ _   _ __   (_) | |_  (_)  ____   ___   _ __
  / __| / __| | '_ \  | '__|  / _ \    | |  _____  / __|  / _` | | '_ \  | | | __| | | |_  /  / _ \ | '__|
 | (__  \__ \ | |_) | | |    | (_) |   | | |_____| \__ \ | (_| | | | | | | | | |_  | |  / /  |  __/ | |
  \___| |___/ | .__/  |_|     \___/   _/ |         |___/  \__,_| |_| |_| |_|  \__| |_| /___|  \___| |_|
              |_|                    |__/


Usage: csproj-sanitizer --filePath [path]

Options:
  --filePath     Relative or Absolute path where the csproj file is located  [required]
  --findPattern                                                  [default: "**/*.{cshtml,cs}"]
  --findIgnores                                                  [default: "{node_modules,obj,bin}/**"]
```

# Author
Giacomo Spettoli
