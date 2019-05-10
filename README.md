# csproj-sanitizer

[![Build status](https://travis-ci.com/giacomos/csproj-sanitizer.svg?branch=master)](https://travis-ci.org/giacomos/csproj-sanitizer)
[![Test Coverage](https://codeclimate.com/github/giacomos/csproj-sanitizer/badges/coverage.svg)](https://codeclimate.com/github/giacomos/csproj-sanitizer)
[![Code Climate](https://codeclimate.com/github/giacomos/csproj-sanitizer/badges/gpa.svg)](https://codeclimate.com/github/giacomos/csproj-sanitizer)
[![dependencies Status](https://david-dm.org/giacomos/csproj-sanitizer/status.svg)](https://david-dm.org/giacomos/csproj-sanitizer)
![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

This mini package helps sanitize your csproj file from duplicates and missing includes.

## Installation

```bash
$ npm i -g csproj-sanitizer
```

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

# Example

```
$ csproj-sanitizer --filePath src/test/examples/missing.csproj
✓ No duplicated includes found.
X 1 missing includes found.
- Missing file in csproj: "src\test\examples\test.cshtml"
```

# Author
Giacomo Spettoli
