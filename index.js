#!/usr/bin/env node

/**
 * gh-msg - Git commit message hook for GitHub issues
 * (c) 2014 Zach Bruggeman
 * MIT License
 *
 * @package gh-msg
 * @author Zach Bruggeman <mail@bruggie.com>
 */

var fs = require('fs');
var sprintf = require('util').format;
var request = require('request');
var auth = require('ghauth');
var argv = require('minimist')(process.argv.slice(2));

var API_HOST = 'https://api.github.com';
var REPO = '{{REPO}}'; // if adding manually, replace this with your repo, in the format of `owner/repo`

var agent = 'gh-msg (https://github.com/remixz/gh-msg)';
var authConfig = {
    configName: 'ghmsg',
    scopes: ['repo'],
    note: agent,
    userAgent: agent
};

auth(authConfig, function (err, res) {
    if (err) return process.exit(1);

    var token = res.token;
    var file = argv._[0];

    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) return process.exit(1);

        var issue = false;
        var lines = data.split('\n');
        var line = lines[0];
        if (line.substring(0, 1) === '#') issue = line.replace('#', '');
        if (line.substring(0, 3) === 'GH-') issue = line.replace('GH-', '');

        if (!issue) return process.exit(0);

        issue = parseInt(issue, 10);

        var req = sprintf('/repos/%s/issues/%d', REPO, issue);
        request({
            uri: API_HOST + req,
            headers: {
                'Authorization': 'token ' + token,
                'User-Agent': 'gh-msg (https://github.com/remixz/gh-msg)'
            },
            json: true
        }, function (err, resp, body) {
            var msg = 'Fixes GH-' + issue + ' - "' + body.title + '"';
            lines.shift();
            msg += '\n' + lines.join('\n');

            fs.writeFile(file, msg, function (err) {
                if (err) return process.exit(1);

                process.exit(0);
            });
        });
    });
});
