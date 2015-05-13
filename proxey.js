'use strict';

var http = require('http');
var fs = require('fs');
var url = require('url');
var mimetype = require('./mimetype.js');

function Proxey() {
	this.proxyUrl = '/proxy';
	this.rootFolder = null;
	this.rootDocument = 'index.html';
	this.port = 5000;
	this.instance = null;
	this.vars = {};
	this.routes = {};
	this.debug = true;
	this.charset = 'utf-8'
	this.proxy = null;
}

Proxey.prototype.getRoute = function (path) {
	return this.routes[path];
};

Proxey.prototype.setConfig = function (config) {
	if (config === undefined) {
		return;
	}
	if (config.debug !== undefined) {
		this.debug = config.debug;
	}
	if (config.port) {
		this.port = config.port;
	}
	if (config.proxyUrl) {
		this.proxyUrl = config.proxyUrl;
	}
	if (config.proxy) {
		this.proxy = config.proxy;
	}
	if (config.rootFolder) {
		this.rootFolder = config.rootFolder;
	}
	if (config.rootDocument) {
		this.rootDocument = config.rootDocument;
	}
	if (config.vars) {
		this.vars = config.vars;
	}
	if (config.routes) {
		this.routes = config.routes;
		if (!this.routes['/']) {
			this.routes['/'] = this.rootDocument;
		}
	}
	if (config.charset) {
		this.charset = config.charset;
	}
};

Proxey.prototype.request = function (req, res, config) {
	var joinSplitedUrl = function (arr) {
		for (var i = 1; i < arr.length; i++) {
			proxyUrl += arr[i];
		}
	}

	var splitedUrl;
	var proxyUrl = '';

	if (config) {
		splitedUrl = req.url.split(config.key);
		proxyUrl = config.value;
		joinSplitedUrl(splitedUrl);
	} else {
		splitedUrl = req.url.split(this.proxyUrl + '?url=');
		joinSplitedUrl(splitedUrl);

		if (splitedUrl.length < 2) {
			res.writeHead(400);
			res.end('GET: ' + req.url + 'INVALID PROXY URL(400)');
			return;
		}
	}

	var parsedUrl = url.parse(decodeURIComponent(proxyUrl));
	var dataString = '';
	var options = {
		hostname: parsedUrl.host,
		port: (req.port ? req.port : 80),
		path: parsedUrl.path,
		method: req.method,
		headers: req.headers
	};
	
	delete options.headers['host'];

	for (var _var in this.vars) {
		var key = _var;
		var value = this.vars[_var];
		if (typeof value == 'string') {
			options.headers[key] = value;
		} else if (typeof value == 'object') {
			if (options.headers[key] !== undefined && options.headers[key].replace(/\_/gim, '') == key) {
				var real = value.real || key;
				options.headers[real] = value.value;
				if (value.real) {
					delete options.headers[key];
				}
			}
		}
	}
	
	var proxy = http.request(options, function (response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			dataString += chunk;
		});
		response.on('end', function () {
			res.writeHead(response.statusCode, response.headers);
			res.end(dataString);
		});
	});

	if (req.body) {
		proxy.write(req.body);
	}

	proxy.end();
};

Proxey.prototype.run = function (config) {
	var top = this;
	this.setConfig(config);
	this.instance = http.createServer(function (req, res) {
		var isProxyUrl = function (url) {
			if (!top.proxy) {
				return false;
			}
			for (var item in top.proxy) {
				if (req.url.indexOf(item) === 0) {
					return true;
				}
			}
			return false;
		}
		var proxyUrlPattern = '^' + top.proxyUrl;
		var template = top.getRoute(req.url);
		if (template) {
			var documentFile = fs.readFileSync(top.rootFolder + '/' + template);
			var documentFileMimetype = template.match(/\.[0-9a-z]+$/i);
			var mime;
			if (!documentFileMimetype) {
				mime = 'text/html';
			} else {
				mime = 	mimetype.get(documentFileMimetype[0].replace('.', ''));
			}
			if (mime === undefined) {
				mime = 'text/html';
			}
			mime += ';charset=' + top.charset;
			res.writeHead(200, {'Content-Type': mime});
			res.end(documentFile);
		} else if (req.url.match(new RegExp(proxyUrlPattern, 'g'))) {
			top.request(req, res);
		} else if (isProxyUrl(req.url)) {
			for (var item in top.proxy) {
				if (req.url.indexOf(item) === 0) {
					top.request(req, res, {key: item, value: top.proxy[item]});
				}
			}
		} else {
			try {
				var resource = req.url;
				var resourceFileMimetype = resource.match(/\.[0-9a-z]+$/i);
				var mime = mimetype.get(resourceFileMimetype[0].replace('.', ''));
				var resourceFile = fs.readFileSync(top.rootFolder + req.url);
				res.writeHead(200, {'Content-Type': mime});
				res.end(resourceFile);
			} catch (e) {
				res.writeHead(404);
				res.end('GET: ' + req.url + 'NOT FOUND(404)');
			}
		}
	}).listen(this.port);
	console.log('Running in port: ' + this.port);
};

Proxey.prototype.stop = function () {
	proxy.stop();
};

var proxey = new Proxey();

module.exports = proxey;
