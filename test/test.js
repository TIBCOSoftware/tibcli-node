/*
 * Copyright © 2017. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */
var assert = require('chai').assert;
var expect = require('chai').expect;
var spawnSync = require('child_process').spawnSync;
var fs = require('fs-extra');
var path = require('path');
var templates = require('../tibcli-node-templates');

var mod = require('../package.json');
var TEST_DIR = './testapp';

describe('File & Folder layout', function () {
    it('has required files', function () {
        expect(fs.existsSync('tibcli-node.js')).to.be.true;
        expect(fs.existsSync('tibcli-node-manifest.js')).to.be.true;
        expect(fs.existsSync('tibcli-node-generate.js')).to.be.true;
        expect(fs.existsSync('tibcli-node-templates.js')).to.be.true;
    });
    describe('File generation templates', function () {
        it('dotenv is a string', function () {
            if (assert.isString(templates.dotenv)) {
                throw ('templates.dotenv does not return a string');
            }
        });
        it('dotenv contains the http port 8000', function () {
            if (assert.notEqual(templates.dotenv.indexOf('HTTP_PORT=8000'), -1)) {
                throw ('the http port is not set to 8000');
            }
        });
        it('server.js is a string', function () {
            if (assert.isString(templates.serverjs)) {
                throw ('templates.serverjs does not return a string');
            }
        });
        it('package.json is a string', function () {
            if (assert.isString(templates.packagejson)) {
                throw ('templates.packagejson does not return a string');
            }
        });
        it('manifest.json is a string', function () {
            if (assert.isString(templates.manifestjson)) {
                throw ('templates.manifestjson does not return a string');
            }
        });
        it('logger.js is a string', function () {
            if (assert.isString(templates.loggerjs)) {
                throw ('templates.loggerjs does not return a string');
            }
        });
    });
});

describe('tibcli-node.js', function () {
    this.slow(10000);
    it('should be version ' + mod.version, () => {
        var result = spawnSync('node', ['tibcli-node', '--version'], { encoding: 'utf-8' });
        expect(result.stdout).to.include(mod.version);
    });
    it('should contain generate and manifest functions', () => {
        var result = spawnSync('node', ['tibcli-node', '--help'], { encoding: 'utf-8' });
        expect(result.stdout).to.include('Manage manifest.json properties');
        expect(result.stdout).to.include('Generation of apps and deployment artifacts');
    });
    it('should fail for unrecognized options', () => {
        var result = spawnSync('node', ['tibcli-node', '--bla'], { encoding: 'utf-8' });
        expect(result.stderr).to.include('unknown option');
        expect(result.stdout).to.include('');
    });
});

describe('tibcli-node-manifest.js', function () {
    this.slow(10000);
    it('should contain add-var and rem-var functions', () => {
        var result = spawnSync('node', ['tibcli-node-manifest', '--help'], { encoding: 'utf-8' });
        expect(result.stdout).to.include('Add an environment variable to the manifest.json');
        expect(result.stdout).to.include('Removes an environment variable from the manifest.json');
    });
    it('should fail for unrecognized options', () => {
        var result = spawnSync('node', ['tibcli-node-manifest', '--bla'], { encoding: 'utf-8' });
        expect(result.stderr).to.include('unknown option');
        expect(result.stdout).to.include('');
    });
    it('should fail when no name and type are specified', () => {
        var result = spawnSync('node', ['tibcli-node-manifest', 'add-var'], { encoding: 'utf-8' });
        expect(result.stderr).to.include('Name and Type were not specified!');
        expect(result.stdout).to.include('');
    });
    it('should fail when no manifest file is specified and no manifest can be found', () => {
        var result = spawnSync('node', ['tibcli-node-manifest', 'add-var', '-N', 'bla', '-T', 'string'], { encoding: 'utf-8' });
        expect(result.stderr).to.include('Cannot find a manifest.json file in this folder!');
        expect(result.stdout).to.include('');
    });
});

describe('tibcli-node-generate.js', function () {
    this.slow(10000);
    it('should contain app and zip functions', () => {
        var result = spawnSync('node', ['tibcli-node-generate', '--help'], { encoding: 'utf-8' });
        expect(result.stdout).to.include('Generate a new Node.js application');
        expect(result.stdout).to.include('Generates a deployment folder with manifest.json and app.zip');
    });
    it('should fail for unrecognized options', () => {
        var result = spawnSync('node', ['tibcli-node-generate', '--bla'], { encoding: 'utf-8' });
        expect(result.stderr).to.include('unknown option');
        expect(result.stdout).to.include('');
    });
    it('should fail when no name and version are supplied', () => {
        var result = spawnSync('node', ['tibcli-node-generate', 'app'], { encoding: 'utf-8' });
        expect(result.stderr).to.include('Name and Version were not specified!');
        expect(result.stdout).to.include('');
    });
    it('should fail when no server.js file is found', () => {
        var result = spawnSync('node', ['tibcli-node-generate', 'zip'], { encoding: 'utf-8' });
        expect(result.stderr).to.include('We couldn\'t find the server.js file');
        expect(result.stdout).to.include('');
    });
});

describe('Generate app and update manifest', function () {
    this.slow(10000);
    before(function () {
        fs.mkdirSync(TEST_DIR);
    });
    it('should generate an app', () => {
        var result = spawnSync('node', ['../tibcli-node-generate', 'app', '-N', 'myapp', '-v', '1.0.0'], { cwd: './testapp', encoding: 'utf-8' });
        expect(fs.existsSync(TEST_DIR + '/manifest.json')).to.be.true;
        expect(fs.existsSync(TEST_DIR + '/myapp/server.js')).to.be.true;
        expect(fs.existsSync(TEST_DIR + '/myapp/package.json')).to.be.true;
        expect(fs.existsSync(TEST_DIR + '/myapp/.env')).to.be.true;
        expect(fs.existsSync(TEST_DIR + '/myapp/util/logger.js')).to.be.true;
    });
    it('should not yet have properties', () => {
        var result = spawnSync('node', ['../tibcli-node-manifest', 'rem-var', '-N', 'myvar'], { cwd: './testapp', encoding: 'utf-8' });
        expect(result.stderr).to.include('The manifest has no properties section!');
    });
    it('should successfully add a property', () => {
        var result = spawnSync('node', ['../tibcli-node-manifest', 'add-var', '-N', 'myvar', '-T', 'string'], { cwd: './testapp', encoding: 'utf-8' });
        expect(result.stdout).to.include('Successfully added environment variable from manifest.json!');
    });
    it('should successfully remove a property', () => {
        var result = spawnSync('node', ['../tibcli-node-manifest', 'rem-var', '-N', 'myvar'], { cwd: './testapp', encoding: 'utf-8' });
        expect(result.stdout).to.include('Successfully removed environment variable from manifest.json!');
    });
    it('should successfully build a zipfile', () => {
        var result = spawnSync('node', ['../tibcli-node-generate', 'zip'], { cwd: './testapp', encoding: 'utf-8' });
        expect(result.stdout).to.include('Deployment folder and artifacts created!');
        expect(fs.existsSync(TEST_DIR + '/deployment/manifest.json')).to.be.true;
        expect(fs.existsSync(TEST_DIR + '/deployment/app.zip')).to.be.true;
    });
    after(function () {
        fs.removeSync(TEST_DIR);
    });
});