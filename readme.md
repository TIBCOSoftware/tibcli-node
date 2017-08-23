# tibcli-node
A command line tool to help developers with Node.js code on TIBCO Cloud Integration

## Install
You can install by downloading the .tgz file from the releases folder
```
$ npm install -g tibcli-node-0.1.0.tgz
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
## Contributors
[Leon Stigter](https://github.com/retgits)

## License
Copyright © 2017. TIBCO Software Inc. This file is subject to the license terms contained in the license file that is distributed with this file.