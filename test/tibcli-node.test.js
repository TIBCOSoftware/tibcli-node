/*
 * Copyright © 2017. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */
const expect = require('chai').expect;
const spawnSync = require('child_process').spawnSync;
const mod = require('../package.json');
const config = require('../config/config.json');

/**
 * Constants
 */
const node = 'node';
const program = 'tibcli-node';

describe('tibcli-node.js', function() {
    this.slow(10000);
    
    it('should be version ' + mod.version, () => {
        let result = spawnSync(node, [program, '--version'], {encoding: 'utf-8'});
        expect(result.stdout).to.include(mod.version);
    });

    it('should contain proper functions', () => {
        let result = spawnSync(node, [program, '--help'], {encoding: 'utf-8'});
        expect(result.stdout).to.include(config.commands.create.description);
        expect(result.stdout).to.include(config.commands.package.description);
        expect(result.stdout).to.include(config.commands.env.description);
    });
    
    it('should fail for unrecognized options', () => {
        let result = spawnSync(node, [program, '--bla'], {encoding: 'utf-8'});
        expect(result.stderr).to.include('unknown option');
        expect(result.stdout).to.include('');
    });
});