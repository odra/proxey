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
		'/api/users': 'users.json'
	}
});
```

Sample without:

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
```
