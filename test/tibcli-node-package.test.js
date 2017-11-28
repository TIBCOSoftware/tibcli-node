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
const program = 'tibcli-node-package';
const test_dir = './testapp';

describe('tibcli-node-package.js', function() {
    this.slow(10000);

    it('should fail for unrecognized options', () => {
        let result = spawnSync(node, [program, '--bla'], {encoding: 'utf-8'});
        expect(result.stderr).to.include('unknown option');
        expect(result.stdout).to.include('');
    });

    it('should contain proper parameters', () => {
        let result = spawnSync(node, [program, '--help'], {encoding: 'utf-8'});
        expect(result.stdout).to.include(config.commands.package.description)
    });

    it('should fail when certain files do not exist', () => {
        let result = spawnSync(node, [program], {encoding: 'utf-8'});
        expect(result.stderr).to.include('does not contain a manifest.json file')
    });

    it('should generate a zip file from a valid project', () => {
        fs.mkdirSync(test_dir);
        let result = spawnSync('node', ['../tibcli-node-create', '--appname', 'myapp', '--appversion', '1.0.0'], {cwd: test_dir, encoding: 'utf-8'});
        result = spawnSync(node, ['../../' + program], {cwd: path.join(test_dir,'myapp'), encoding: 'utf-8'});
        expect(fs.existsSync(test_dir + '/deployment/app.zip')).to.be.true;
    });

    after(function() {
        fs.removeSync(test_dir);
    });
});