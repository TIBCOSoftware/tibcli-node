#!/usr/bin/env node

/*
 * Copyright © 2017. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

var cli = require('commander');

cli
    .version('0.2.2')
    .description('Help developers with Node.js code on TIBCO Cloud Integration')
    .command('generate','Generation of apps and deployment artifacts')
    .command('manifest','Manage manifest.json properties')
    .parse(process.argv);