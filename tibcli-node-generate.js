/*
 * Copyright © 2017. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

var cli = require('commander');
var templates = require('./tibcli-node-templates');
var fs = require('fs.extra');

cli
    .option('-N, --name <name>', 'The name of the app')
    .option('-v, --appversion <version>', 'The version of the app')

cli
    .command('app')
    .description('Generate a new Node.js application')
    .action(function (options) {
        if (cli.name == null || cli.appversion == null) {
            console.error(' ');
            console.error('Name and Version were not specified!');
            console.error(' ');
            process.exit();
        }
        manifestContent = templates.manifestjson
        manifestContent = manifestContent.replace(/%%APPNAME%%/g, cli.name);
        manifestContent = manifestContent.replace(/%%APPVERSION%%/g, cli.appversion);
        fs.writeFileSync(process.cwd() + '/manifest.json', manifestContent, 'utf-8');

        fs.mkdirSync(process.cwd() + '/' + cli.name);
        fs.mkdirSync(process.cwd() + '/' + cli.name + '/util');

        packageJsonContent = templates.packagejson
        packageJsonContent = packageJsonContent.replace(/%%APPNAME%%/g, cli.name);
        packageJsonContent = packageJsonContent.replace(/%%APPVERSION%%/g, cli.appversion);
        fs.writeFileSync(process.cwd() + '/' + cli.name + '/package.json', packageJsonContent, 'utf-8');

        loggerJsContent = templates.loggerjs
        fs.writeFileSync(process.cwd() + '/' + cli.name + '/util/logger.js', loggerJsContent, 'utf-8');

        configContent = templates.dotenv
        fs.writeFileSync(process.cwd() + '/' + cli.name + '/.env', configContent, 'utf-8');

        serverJsContent = templates.serverjs
        fs.writeFileSync(process.cwd() + '/' + cli.name + '/server.js', serverJsContent, 'utf-8');
    })

cli
    .command('zip')
    .description('Generates a deployment folder with manifest.json and app.zip')
    .action(function (options) {
        var appRootFolder = determineAppRootFolder()

        if (appRootFolder == null) {
            console.error(' ');
            console.error('We couldn\'t find the server.js file :(');
            console.error(' ');
            process.exit();
        }
        if (appRootFolder == process.cwd()) {
            var parentFolder = appRootFolder.substring(0, appRootFolder.lastIndexOf('\\'));
            fs.mkdirSync(parentFolder + '/deployment');
        } else {
            fs.mkdirSync(process.cwd() + '/deployment');
        }
        fs.copy(appRootFolder + '/../manifest.json', appRootFolder + '/../deployment/manifest.json', function (err) {
            if (err) {
                throw err;
            }
        });

        if (/^win/.test(process.platform)) {

            var spawn = require("child_process").spawn, child;
            child = spawn("powershell.exe", ['Get-ChildItem ' + appRootFolder + ' | where { $_.Name -notin "node_modules"} | Compress-Archive -DestinationPath ' + appRootFolder + '/../deployment/app.zip -Force']);
            child.stdout.on("data", function (data) {
                console.log("Powershell Data: " + data);
            });
            child.stderr.on("data", function (data) {
                console.log("Powershell Errors: " + data);
            });
            child.stdin.end();

            console.log('Deployment folder and artifacts created!');
        } else if (/^darwin/.test(process.platform)) {
            
            var spawn = require("child_process").spawn, child;
            child = spawn("zip", ['-r','-X',appRootFolder + '/../deployment/app.zip',appRootFolder,'-x','"node_modules"']);
            child.stdout.on("data", function (data) {
                console.log("Bash Data: " + data);
            });
            child.stderr.on("data", function (data) {
                console.log("Bash Errors: " + data);
            });
            child.stdin.end();

            console.log('Deployment folder and artifacts created!');
        } else {
            console.error(' ');
            console.error('This command is not supported on ' + process.platform);
            console.error(' ');
            process.exit();
        }
    })


cli.parse(process.argv);

/**
 * Determines the rootfolder of the Node.js app
 * This is determined by which folder contains server.js
 */
function determineAppRootFolder() {
    var appRootFolder = null;
    if (fs.existsSync(process.cwd() + '/server.js')) {
        appRootFolder = process.cwd();
    }

    var dirs = fs.readdirSync(process.cwd()).filter(function (file) {
        return fs.statSync(process.cwd() + '/' + file).isDirectory();
    });

    dirs.forEach(function (element) {
        if (fs.existsSync(process.cwd() + '/' + element + '/server.js')) {
            appRootFolder = process.cwd() + '/' + element;
        }
    });

    return appRootFolder;
}