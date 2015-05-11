Proxey
==

Nodejs server proxy for web app developers

Instalation
--
```sh
$ npm install proxey
```

How to Use
---
- rootFolder: the web app folder;
- rootDocument: document to be rendered as the main html;
- port: port to run, default is 5000 (optional);
- vars: a json containing additional headers to be sent in each proxy request (optional);
	- if the var value will be inserted in all proxy requests if it is a string;
	- the value can be a json with some opttions, so it can be used dynamically;
- proxyUrl: a path to be used as the proxy url to send json requests, default is "/proxy" (optional);
- routes: a json containing a path and its relative html view file to render. If the '/' route is not set, it will use the rootDocument prop (default index.html) as the default view file;
- charset: the charset to be used in the proxy responses, default is "utf-8".

Sample with routes:

```js
var server = require('proxey');

server.run({
	rootFolder: './app',
	port: 5000,
	proxyUrl: '/proxy',
	vars: {
		'X-Api-Token': '12345'
	},
	routes: {
		'/': 'home.html',
		'/users': 'users.html',
		'/api/users',: 'users.json'
	},
	charset: 'utf-8'
});
```

Sample without routes:

```js
var server = require('proxey');

server.run({
	rootFolder: './app',
	rootDocument: 'index.html',
	port: 5000,
	proxyUrl: '/proxy',
	vars: {
		'X-Api-Token': '12345'
	}
});
```

Sample with custom headers:

```js
var server = require('proxey');

server.run({
	rootFolder: './app',
	rootDocument: 'index.html',
	port: 5000,
	proxyUrl: '/proxy',
	vars: {
		'X-Api-Token': '12345',
		'x-whatever': {
			'real': 'X-Whatever' //proxy will use this header name,
			'value': 'header-value'
		}
	}
});
```

When running the server, all resource files (css, js, imgs, etc) can be used with a relative path (css/styles.css).

The Proxy
--

Every request sent to the proxy url needs to have an encoded url patameter:
```js
'/proxy?url=' + encodeURIComponent('http://www.google.com');
```

Every http request sent to this url will be forwarded to the given "url" query string param, with all the headers, parameters and request body of the ajax method:

```js
//sample jquery request
$.get('/proxy?url=' + encodeURIComponent('http://www.google.com'));

//jquery with custom headers
var url = 'http://www.google.com';
var headers = {
	'x-whatever' = '__x-whatever__' // __ to use dynamic values
};
$.ajax({
	url: '/proxy?url=' + encodeURIComponent(url),
	headers: headers
})
.always(function (data) {
	console.log(data);
});
```

The proxy will intenfity the "x-whatever" due to its name and the __\_\_x-whatever\_\___ which indicates proxey to use the custom header:

X-Whatever: header-value

The MIT License (MIT)
==

Copyright (c) 2015 Leonardo Rossetti <leonardo@goldark.com.br>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

