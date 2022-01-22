# Check package version

This action checks whether the version number in package.json is higher than the version on master branch.

## Usage

```yaml
name: Check Version

on:
  pull_request:
    branches:
      - master
      - main

jobs:
  version-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ./
```
