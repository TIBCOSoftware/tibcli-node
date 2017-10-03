/*
 * Copyright © 2017. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

/* eslint-disable max-len */

const cli = require('commander');
const fs = require('fs');
const path = require('path');

cli
    .option('-N, --name <name>', 'The name of the variable to add or remove')
    .option('-T, --type <type>', 'The type of the variable to add')
    .option('-V, --value <value>', 'The default value for the variable in the manifest, you still need to explicitly set the value in your code')
    .option('-f --file [file]', 'The full path of the manifest file, if no file is given we assume the file is in this folder');

cli
    .command('add-var')
    .description('Add an environment variable to the manifest.json')
    .action(function(options) {
        if (cli.name == null || cli.type == null) {
            console.error(' ');
            console.error('Name and Type were not specified!');
            console.error(' ');
            process.exit();
        }
        parseManifest('add', cli.name, cli.type, cli.value);
    });

cli
    .command('rem-var')
    .description('Removes an environment variable from the manifest.json')
    .action(function(options) {
        if (cli.name == null) {
            console.error(' ');
            console.error('Name not specified!');
            console.error(' ');
            process.exit();
        }
        parseManifest('remove', cli.name);
    });


cli.parse(process.argv);

/**
 * Function to parse the manifest and depending on the action remove or add the variable
 * @param {String} action 
 * @param {String} name 
 * @param {String} type
 * @param {String} value 
 */
function parseManifest(action, name, type, value) {
    let manifestFile = '';

    if (cli.file != null) {
        manifestFile = cli.file;
    } else {
        manifestFile = process.cwd() + path.sep + 'manifest.json';
    }

    if (!fs.existsSync(manifestFile)) {
        console.error(' ');
        console.error('Cannot find a manifest.json file in this folder!');
        console.error('Cannot complete this action');
        console.error(' ');
        process.exit();
    }

    let manifestContent = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    let propertiesSection = manifestContent.properties;

    if (action == 'add') {
        if (propertiesSection == null) {
            propertiesSection = [];
        }
        let newProp = JSON.parse('{"name" : "' + name + '","datatype" : "' + type + '","default" : "' + value + '"}');
        propertiesSection.push(newProp);
        console.log(' ');
        console.log('Successfully added environment variable from manifest.json!');
        console.log(' ');
    } else {
        if (propertiesSection == null) {
            console.error(' ');
            console.error('The manifest has no properties section!');
            console.error(' ');
            process.exit();
        } else {
            let found = false;
            for (let i = 0; i <= propertiesSection.length - 1; i++) {
                if (propertiesSection[i].name == name) {
                    removeFromArrayByIndex(propertiesSection, i);
                    found = true;
                }
            }
            if (found) {
                console.log(' ');
                console.log('Successfully removed environment variable from manifest.json!');
                console.log(' ');
            } else {
                console.error(' ');
                console.error('The manifest has no environment variable with the name ' + name + '!');
                console.error(' ');
            }
        }
    }

    manifestContent.properties = propertiesSection;

    fs.writeFileSync(manifestFile, JSON.stringify(manifestContent), 'utf8');
}

/**
 * Removes a particular index from the array
 * @param {*} array 
 * @param {*} index 
 */
function removeFromArrayByIndex(array, index) {
    array.splice(index, 1);
}
