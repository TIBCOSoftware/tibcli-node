# tibcli-node
A command line tool to help developers with Node.js code on TIBCO Cloud Integration

## Usage
```
Usage: tibcli-node [options] [command]

Help developers with Node.js code on TIBCO Cloud Integration

Options:

  -V, --version  output the version number
  -h, --help     output usage information

Commands:

  generate    Generation of apps and deployment artifacts
  manifest    Manage manifest.json properties
  help [cmd]  display help for [cmd]
```

## Manifest
Adds environment variables to and removes them from the manifest.json file so you can use them with `process.env` in your Node.js code

### Add a new variable
```
$ tibcli-node manifest add-var -N DB_USER -T string
```
### Remove a variable
```
$ tibcli-node manifest rem-var -N DB_USER
```

### Usage
```
Usage: tibcli-node manifest [command] [options]

Options:

  -N, --name <name>  The name of the variable to add or remove
  -T, --type <type>  The type of the variable to add
  -h, --help         output usage information

Commands:

  add-var   Add an environment variable to the manifest.json
  rem-var   Removes an environment variable from the manifest.json
```
## Generate
Helps you create a completely new Node.js app or helps to speed up deployment by creating the zip and moving that, together with the manifest.json file, into a deployment folder
### Generate a new Node.js app
```
$ tibcli-node generate app -N MyApp -v 1.0.0
```
### Generate a deployment folder
```
$ tibcli-node generate zip
```
### Usage
```
Usage: tibcli-node-generate [command] [options]

Options:

  -N, --name <name>           The name of the app
  -v, --appversion <version>  The version of the app
  -h, --help                  output usage information

Commands:

  app   Generate a new Node.js application
  zip   Generates a deployment folder with manifest.json and app.zip
```
## Contributors
[Leon Stigter](https://github.com/retgits)

## License
The MIT License (MIT)

Copyright (c) 2017 retgits

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.