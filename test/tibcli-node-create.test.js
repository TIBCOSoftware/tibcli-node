/*
 * Copyright © 2017. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */
const expect = require('chai').expect;
const spawnSync = require('child_process').spawnSync;
const mod = require('../package.json');
const config = require('../config/config.json');
const fs = require('fs-extra');

/**
 * Constants
 */
const node = 'node';
const program = 'tibcli-node-create';
const test_dir = './testapp';

describe('tibcli-node-create.js', function() {
    this.slow(10000);
    
    before(function() {
        fs.mkdirSync(test_dir);
    });

    it('should fail for unrecognized options', () => {
        let result = spawnSync(node, [program, '--bla'], {encoding: 'utf-8'});
        expect(result.stderr).to.include('unknown option');
        expect(result.stdout).to.include('');
    });

    it('should contain proper parameters', () => {
        let result = spawnSync(node, [program, '--help'], {encoding: 'utf-8'});
        expect(result.stdout).to.include(config.commands.create.parameters.name.description)
        expect(result.stdout).to.include(config.commands.create.parameters.version.description)
        expect(result.stdout).to.include(config.commands.create.parameters.git.description)
        expect(result.stdout).to.include(config.commands.create.parameters.github.description)
    });

    it('should display help when no parameters are given', () => {
        let result = spawnSync(node, [program], {encoding: 'utf-8'});
        expect(result.stdout).to.include(config.commands.create.parameters.name.description)
        expect(result.stdout).to.include(config.commands.create.parameters.version.description)
        expect(result.stdout).to.include(config.commands.create.parameters.git.description)
        expect(result.stdout).to.include(config.commands.create.parameters.github.description)
    });

    it('should stop when version is not specified', () => {
        let result = spawnSync(node, [program, '--appname','app'], {encoding: 'utf-8'});
        expect(result.stderr).to.include('The name (app) or version (undefined) are not correctly specified')
    });

    it('should stop when appname is not specified', () => {
        let result = spawnSync(node, [program, '--appversion','1.0.0'], {encoding: 'utf-8'});
        expect(result.stderr).to.include('The name (undefined) or version (1.0.0) are not correctly specified')
    });

    it('should generate an app', () => {
        let result = spawnSync('node', ['../' + program, '--appname', 'myapp', '--appversion', '1.0.0'], {cwd: test_dir, encoding: 'utf-8'});
        expect(fs.existsSync(test_dir + '/manifest.json')).to.be.true;
        expect(fs.existsSync(test_dir + '/myapp/server.js')).to.be.true;
        expect(fs.existsSync(test_dir + '/myapp/package.json')).to.be.true;
        expect(fs.existsSync(test_dir + '/myapp/.env')).to.be.true;
        expect(fs.existsSync(test_dir + '/myapp/util/logger.js')).to.be.true;
    });

    after(function() {
        fs.removeSync(test_dir);
    });
});