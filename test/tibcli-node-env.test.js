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
const path = require('path');

/**
 * Constants
 */
const node = 'node';
const program = 'tibcli-node-env';
const test_dir = './testapp';

describe('tibcli-node-env.js', function() {
    this.slow(10000);

    it('should fail for unrecognized options', () => {
        let result = spawnSync(node, [program, '--bla'], {encoding: 'utf-8'});
        expect(result.stderr).to.include('unknown option');
        expect(result.stdout).to.include('');
    });

    it('should contain proper parameters', () => {
        let result = spawnSync(node, [program, '--help'], {encoding: 'utf-8'});
        expect(result.stdout).to.include(config.commands.addvar.description)
        expect(result.stdout).to.include(config.commands.delvar.description)
    });

    it('should fail when certain files do not exist', () => {
        let result = spawnSync(node, [program, 'delvar', '--varname', 'myvar'], {encoding: 'utf-8'});
        expect(result.stderr).to.include('does not contain a manifest.json file')
    });

    it('should prepare properties section properly', () => {
        fs.mkdirSync(test_dir);
        let result = spawnSync('node', ['../tibcli-node-create', '--appname', 'myapp', '--appversion', '1.0.0'], {cwd: test_dir, encoding: 'utf-8'});
        result = spawnSync(node, ['../' + program, 'delvar', '--varname', 'myvar'], {cwd: test_dir, encoding: 'utf-8'});
        expect(result.stderr).to.include('The manifest has no properties section')
        result = spawnSync(node, ['../' + program, 'addvar', '--varname', 'myvar', '--type', 'string', '--value', '1'], {cwd: test_dir, encoding: 'utf-8'});
        expect(result.stdout).to.include('Successfully added environment variable from manifest.json')
        result = spawnSync(node, ['../' + program, 'delvar', '--varname', 'myvar'], {cwd: test_dir, encoding: 'utf-8'});
        expect(result.stdout).to.include('Successfully removed environment variable from manifest.json')
        result = spawnSync(node, ['../' + program, 'delvar', '--varname', 'myvar'], {cwd: test_dir, encoding: 'utf-8'});
        expect(result.stderr).to.include('The manifest has no environment variable called')
    });

    after(function() {
        fs.removeSync(test_dir);
    });
});