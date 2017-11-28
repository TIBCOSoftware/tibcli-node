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

/**
 * Env command
 */
cli
    .description(config.commands.env.description)
    .option(config.commands.env.parameters.name.name,
        config.commands.env.parameters.name.description)
    .option(config.commands.env.parameters.type.name,
        config.commands.env.parameters.type.description)
    .option(config.commands.env.parameters.value.name,
        config.commands.env.parameters.value.description);

/**
 * Addvar command
 */
cli
    .command(config.commands.addvar.name)
    .description(config.commands.addvar.description)
    .action(function(options) {
        if (cli.varname == null || cli.type == null) {
            console.error(chalk.red(`The name (${cli.varname}) or type (${cli.type}) are not correctly specified`)); // eslint-disable-line max-len
            cli.help();
            process.exit();
        } else {
            updateManifestVariables(config.commands.addvar.name, cli.varname,
                cli.type, cli.value);
        }
    });

/**
 * Delvar command
 */
cli
    .command(config.commands.delvar.name)
    .description(config.commands.delvar.description)
    .action(function(options) {
        if (cli.varname == null) {
            console.error(chalk.red(`The name (${cli.varname}) is not correctly specified`)); // eslint-disable-line max-len
            cli.help();
            process.exit();
        } else {
            updateManifestVariables(config.commands.delvar.name, cli.varname);
        }
    });

cli.parse(process.argv);

/**
 * If none of the commands match, display the help
 */
if ((process.argv.indexOf(config.commands.addvar.name) == -1) &&
    (process.argv.indexOf(config.commands.delvar.name) == -1)) {
    cli.help();
    process.exit();
}

/**
 * Function to update the manifest and depending on the action remove
 * or add the variable
 * @param {String} action
 * @param {String} name
 * @param {String} type
 * @param {String} value
 */
function updateManifestVariables(action, name, type, value) {
    if (!fs.existsSync(path.join(process.cwd(), 'manifest.json'))) {
        console.error(chalk.red(`The directory (${process.cwd()}) does not contain a manifest.json file`)); // eslint-disable-line max-len
        process.exit();
    }

    let manifest = fs.readJSONSync(path.join(process.cwd(), 'manifest.json'));

    let properties = manifest.properties;

    if (action == config.commands.addvar.name) {
        if (properties == null) {
            properties = [];
        }
        let property = {name: name, datatype: type, default: value};
        properties.push(property);
        console.log(chalk.dim('Successfully added environment variable from manifest.json!')); // eslint-disable-line max-len
    } else {
        if (properties == null) {
            console.error(chalk.red('The manifest has no properties section!'));
            process.exit();
        } else {
            let found = false;
            for (let i = 0; i <= properties.length - 1; i++) {
                if (properties[i].name == name) {
                    removeFromArrayByIndex(properties, i);
                    found = true;
                }
            }
            if (found) {
                console.log(chalk.dim('Successfully removed environment variable from manifest.json!')); // eslint-disable-line max-len
            } else {
                console.error(chalk.red(`The manifest has no environment variable called (${name})`)); // eslint-disable-line max-len
            }
        }
    }

    manifest.properties = properties;
    fs.writeJSONSync(path.join(process.cwd(), 'manifest.json'),
        manifest, 'utf-8');
}

/**
 * Removes a particular index from the array
 * @param {*} array
 * @param {*} index
 */
function removeFromArrayByIndex(array, index) {
    array.splice(index, 1);
}
