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
const os = require('os');

/**
 * Welcome message
 */
let art = '';
art = `${art} __   __ __          __ __                       __        ${os.EOL}`; // eslint-disable-line max-len
art = `${art}|  |_|__|  |--.----.|  |__|______.-----.-----.--|  |.-----.${os.EOL}`; // eslint-disable-line max-len
art = `${art}|   _|  |  _  |  __||  |  |______|     |  _  |  _  ||  -__|${os.EOL}`; // eslint-disable-line max-len
art = `${art}|____|__|_____|____||__|__|      |__|__|_____|_____||_____|${os.EOL}`; // eslint-disable-line max-len
art = `${art}                        The tibcli for Node.js apps, v${config.version}${os.EOL}`; // eslint-disable-line max-len

console.log(chalk.blue(art));

/**
 * Main command
 */
cli
    .version(config.version)
    .description(config.description)
    .command(config.commands.create.name, config.commands.create.description)
    .command(config.commands.package.name, config.commands.package.description)
    .command(config.commands.env.name, config.commands.env.description)
    .parse(process.argv);
