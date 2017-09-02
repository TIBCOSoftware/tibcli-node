/*
 * Copyright © 2017. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

/* eslint-disable max-len */

const cli = require('commander');
const templates = require('./tibcli-node-templates');
const fs = require('fs-extra');

cli
    .option('-N, --name <name>', 'The name of the app')
    .option('-v, --appversion <version>', 'The version of the app')
    .option('-g, --git', 'Initialize an empty git repo')
    .option('-G, --github', 'Create a new GitHub repo (you\'ll be promted for a token)');

cli
    .command('app')
    .description('Generate a new Node.js application')
    .action(function(options) {
        if (cli.name == null || cli.appversion == null) {
            console.error(' ');
            console.error('Name and Version were not specified!');
            console.error(' ');
            process.exit();
        }

        let manifestContent = templates.manifestjson;
        manifestContent = manifestContent.replace(/%%APPNAME%%/g, cli.name);
        manifestContent = manifestContent.replace(/%%APPVERSION%%/g, cli.appversion);
        fs.writeFileSync(process.cwd() + '/manifest.json', manifestContent, 'utf-8');

        fs.mkdirsSync(process.cwd() + '/' + cli.name);
        fs.mkdirsSync(process.cwd() + '/' + cli.name + '/util');

        let packageJsonContent = templates.packagejson;
        packageJsonContent = packageJsonContent.replace(/%%APPNAME%%/g, cli.name);
        packageJsonContent = packageJsonContent.replace(/%%APPVERSION%%/g, cli.appversion);
        fs.writeFileSync(process.cwd() + '/' + cli.name + '/package.json', packageJsonContent, 'utf-8');

        let loggerJsContent = templates.loggerjs;
        fs.writeFileSync(process.cwd() + '/' + cli.name + '/util/logger.js', loggerJsContent, 'utf-8');

        let configContent = templates.dotenv;
        fs.writeFileSync(process.cwd() + '/' + cli.name + '/.env', configContent, 'utf-8');

        let serverJsContent = templates.serverjs;
        fs.writeFileSync(process.cwd() + '/' + cli.name + '/server.js', serverJsContent, 'utf-8');

        if (cli.git || cli.github) {
            let simpleGit = require('simple-git')(process.cwd());
            simpleGit.init();
            if (cli.github) {
                let GitHubApi = require('github');
                let github = new GitHubApi({});

                let readline = require('readline');
                const rl = readline.createInterface({
                  input: process.stdin,
                  output: process.stdout,
                });

                rl.question('Please paste the access key of your GitHub account: ', (answer) => {
                  github.authenticate({
                        type: 'token',
                        token: answer,
                    });
                    github.repos.create({
                        name: cli.name,
                    }, function(err, res) {
                        console.log(res.data.html_url);
                        simpleGit.addRemote('origin', res.data.html_url);
                    });
                  rl.close();
                });
            }
        }
    });

cli
    .command('zip')
    .description('Generates a deployment folder with manifest.json and app.zip')
    .action(function(options) {
        let appRootFolder = determineAppRootFolder();

        if (appRootFolder == null) {
            console.error(' ');
            console.error('We couldn\'t find the server.js file :(');
            console.error(' ');
            process.exit();
        }
        if (appRootFolder == process.cwd()) {
            let parentFolder = appRootFolder.substring(0, appRootFolder.lastIndexOf('\\'));
            fs.mkdirsSync(parentFolder + '/deployment');
        } else {
            fs.mkdirsSync(process.cwd() + '/deployment');
        }

        fs.copySync(appRootFolder + '/../manifest.json', appRootFolder + '/../deployment/manifest.json', {overwrite: true});

        let spawn = require('child_process').spawn;
        let child = null;

        if (/^win/.test(process.platform)) {
            child = spawn('powershell.exe', ['Get-ChildItem ' + appRootFolder + ' | where { $_.Name -notin "node_modules"} | Compress-Archive -DestinationPath ' + appRootFolder + '/../deployment/app.zip -Force'], {cwd: appRootFolder});
            console.log('Deployment folder and artifacts created!');
        } else if (/^darwin/.test(process.platform)) {
            child = spawn('zip', ['-r', '-X', appRootFolder + '/../deployment/app.zip', appRootFolder, '-x', '"node_modules"'], {cwd: appRootFolder});
            console.log('Deployment folder and artifacts created!');
        } else if (/^linux/.test(process.platform)) {
            child = spawn('zip', ['-r', '-X', appRootFolder + '/../deployment/app.zip', appRootFolder, '-x', '"node_modules"'], {cwd: appRootFolder});
            console.log('Deployment folder and artifacts created!');
        } else {
            console.error(' ');
            console.error('This command is not supported on ' + process.platform);
            console.error(' ');
            process.exit();
        }

        child.stdout.on('data', function(data) {
            console.log(data);
        });
        child.stderr.on('data', function(data) {
            console.error(data);
        });
        child.stdin.end();
    });


cli.parse(process.argv);

/**
 * Determines the rootfolder of the Node.js app
 * This is determined by which folder contains server.js
 * @return {String} appRootFolder
 */
function determineAppRootFolder() {
    let appRootFolder = null;
    if (fs.existsSync(process.cwd() + '/server.js')) {
        appRootFolder = process.cwd();
    }

    let dirs = fs.readdirSync(process.cwd()).filter(function(file) {
        return fs.statSync(process.cwd() + '/' + file).isDirectory();
    });

    dirs.forEach(function(element) {
        if (fs.existsSync(process.cwd() + '/' + element + '/server.js')) {
            appRootFolder = process.cwd() + '/' + element;
        }
    });

    return appRootFolder;
}
