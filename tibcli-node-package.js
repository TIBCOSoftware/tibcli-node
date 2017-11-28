#!/usr/bin/env node

/*
 * Copyright © 2017. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

/**
 * Requires
 */
const chalk = require('chalk');
const cli = require('commander');
const config = require('./config/config');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

/**
 * Package command
 */
cli
    .description(config.commands.package.description)
    .parse(process.argv);

/**
 * Validate existance of files
 * 1) Check that the current directory contains a package.json file
 * 2) Check the 'main' file exists
 * 3) Check the manifest.json exists in the parent folder
 */
if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.error(chalk.red(`The directory (${process.cwd()}) does not contain a package.json file`)); // eslint-disable-line max-len
    process.exit();
}

let file = fs.readJSONSync(path.join(process.cwd(), 'package.json'));
if (!fs.existsSync(path.join(process.cwd(), file.main))) {
    console.error(chalk.red(`The main file (${file.main}) does not exist`));
    process.exit();
}

if (!fs.existsSync(path.join(process.cwd(), '..', 'manifest.json'))) {
    console.error(chalk.red(`The directory (${path.join(process.cwd(), '..')}) does not contain a manifest.json file`)); // eslint-disable-line max-len
    process.exit();
}

/**
 * Create a folder for the deployment in the parent folder
 */
fs.mkdirsSync(path.join(process.cwd(), '..', 'deployment'));

/**
 * Copy the manifest.json there
 */
fs.copySync(path.join(process.cwd(), '..', 'manifest.json'),
    path.join(process.cwd(), '..', 'deployment', 'manifest.json'),
    {overwrite: true});

/**
 * Create a file to stream archive data to
 */
let output = fs.createWriteStream(path.join(process.cwd(),
    '..', 'deployment', 'app.zip'));
let archive = archiver('zip', {
    zlib: {level: 9},
});

/**
 * Receive the 'close' event, meaning the zip file was created
 */
output.on('close', function() {
  console.log(chalk.dim('The zip file has been created'));
  console.log(chalk.dim(`The app.zip file is ${archive.pointer()} bytes.`));
});

/**
 * Catch all errors, warnings and other events that are fired
 *
 * The 'end' event is fired when the data source is drained no matter what
 * was the data source. It is not part of this library but rather from the
 * NodeJS Stream API.
 * @see: https://nodejs.org/api/stream.html#stream_event_end
 */
output.on('end', function() {
    console.log(chalk.red('Data has been drained'));
});

archive.on('warning', function(err) {
    console.log(chalk.yellow(err));
});

archive.on('error', function(err) {
    console.log(chalk.red(err));
});

/**
 * Pipe archive data to the file and add all files
 * excluding the node_modules folder and as a last step finalize
 * the archive.
 */
archive.pipe(output);

archive.glob('**/*', {dot: true, ignore: 'node_modules/**'});

archive.finalize();
