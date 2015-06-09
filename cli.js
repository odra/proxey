#!/usr/bin/env node

var proxey = require('./proxey.js');
var args = process.argv;
var fs = require('fs');

function CLI (data) {
	this.data = data || null;
};

CLI.prototype.loadFile = function (callback) {
	var configFilename = 'proxey.json';
	fs.readFile(__dirname + '/' + configFilename, 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}
		this.data = JSON.parse(data);
		if (callback) {
			callback();
		}
	});
};

CLI.prototype.run = function () {
	proxey.run(this.data);
};

var cli = new CLI();

if (args.length <= 2) {
	cli.loadFile(function () {
		cli.run();
	});

} else {
	var userArgs = args.slice(2);
	cli.loadArgs(userArgs, function () {
		cli.run();
	});
}