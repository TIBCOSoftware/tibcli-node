# tibcli-node

![](https://travis-ci.org/TIBCOSoftware/tibcli-node.svg)
![](https://img.shields.io/badge/release-v0.2.2-blue.svg)
![](https://img.shields.io/badge/dependencies-up%20to%20date-green.svg)
![](https://img.shields.io/badge/license-BSD%20style-blue.svg)

A command line tool to help developers with Node.js code on TIBCO Cloud Integration

## Build and contribute
### Build from source
You can build your own installer of the plugin by downloading the source from this repository and following a few easy steps:
```bash
# clone this repository
$ git clone https://github.com/TIBCOSoftware/tibcli-node

# create a tgz
$ cd tibcli-node
npm pack
```

### Running unit tests
If you make changes, please be sure to update the test cases in `/test/test.js` or add your own test file and make sure the tests are completing successfully before sending a pull request.

### Linting
This project uses the Google style guide for JavaScript with some notable exceptions:
* The linebreak style check is turned off
* Switch colon spacing is turned off
* Max line length is turned off

To run the the linter and see if your code conforms to the standards execute `npm run-script linter`

## Install
You can install by downloading the .tgz file from the releases folder
```
$ npm install -g tibcli-node-x.x.x.tgz
```

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
  -f --file [file]   The full path of the manifest file, if no file is given we assume the file is in this folder
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

## Other TIBCO Cloud Integration repos
You might also want to visit our other repos
* [tci-awesome](https://github.com/TIBCOSoftware/tci-awesome), a curated set of awesome projects built on TIBCO Cloud Integration
* [Connectors for TIBCO Business Studio - Cloud Edition](https://github.com/TIBCOSoftware/tci-studio-samples)
* [tci-webintegrator](https://github.com/TIBCOSoftware/tci-webintegrator), the SDK to build cool extensions for our Web Integrator
* [Visual Studio Code extension for Node.js](https://github.com/TIBCOSoftware/vscode-extension-tci)

## Contributors
[Leon Stigter](https://github.com/retgits)

## License
Copyright © 2017. TIBCO Software Inc. This file is subject to the license terms contained in the license file that is distributed with this file.