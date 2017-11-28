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
const templates = require('./tibcli-node-templates');

cli
    .description(config.commands.create.description)
    .option(config.commands.create.parameters.name.name,
        config.commands.create.parameters.name.description)
    .option(config.commands.create.parameters.version.name,
        config.commands.create.parameters.version.description)
    .option(config.commands.create.parameters.git.name,
        config.commands.create.parameters.git.description)
    .option(config.commands.create.parameters.github.name,
        config.commands.create.parameters.github.description)
    .parse(process.argv);

/**
 * Main part of the create flow
 */
if (cli.appname == null || cli.appversion == null) {
    console.error(chalk.red(`The name (${cli.appname}) or version (${cli.appversion}) are not correctly specified`)); // eslint-disable-line max-len
    cli.help();
    process.exit();
}

let appname = cli.appname;
let appversion = cli.appversion;

/**
 * Create the directories needed for the files
 */
fs.mkdirsSync(path.join(process.cwd(), appname));
fs.mkdirsSync(path.join(process.cwd(), appname, 'util'));

/**
 * Prepare the manifest.json
 */
let manifest = templates.manifest;
manifest.name = appname;
manifest.description = 'Node.js app for ' + appname;
manifest.version = appversion;
manifest.endpoints[0].spec.name = appname;
manifest.endpoints[0].spec.version = appversion;

/**
 * Prepare the package.json
 */
let packagefile = templates.package;
packagefile.name = appname;
packagefile.description = 'Node.js app for ' + appname;
packagefile.version = appversion;

/**
 * Write the files to disk
 */
fs.writeJSONSync(path.join(process.cwd(), 'manifest.json'),
    manifest, 'utf-8');
fs.writeJSONSync(path.join(process.cwd(), appname, 'package.json'),
    packagefile, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), appname, 'util', 'logger.js'),
    templates.logger, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), appname, '.env'),
    templates.dotenv, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), appname, 'server.js'),
    templates.server, 'utf-8');

console.log('Your app has been created!');

/**
 * If the --use-git or --use-github flags are set create a git repo and
 * optionally a github repo
 */
if (cli.useGit || cli.useGithub) {
    let simpleGit = require('simple-git')(process.cwd());
    simpleGit.init();
    if (cli.useGithub) {
        let GitHubApi = require('github');
        let github = new GitHubApi({});

        let readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(chalk.dim('Please paste the access key of your GitHub account: '), (answer) => { // eslint-disable-line max-len
          github.authenticate({
                type: 'token',
                token: answer,
            });
            github.repos.create({
                name: cli.name,
            }, function(err, res) {
                simpleGit.addRemote('origin', res.data.html_url);
            });
          rl.close();
          console.log(chalk.dim('Your GitHub repo has been created!'));
        });
    } else {
        console.log(chalk.dim('Your git repo has been created!'));
    }
}
