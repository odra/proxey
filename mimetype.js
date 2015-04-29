'use strict';

var mime = {
	types: require('./mimetypes.json'),
	load: function() {
		var file = fs.readFileSync('./mimetypes.json');
		mime.types = JSON.parse(file);
	},
	has: function (mimetype) {
		return this.types[mimetype] !== undefined;
	},
	get: function (mimetype) {
		for (var item in  this.types) {
			for (var i = 0; i < this.types[item].length; i++) {
				if (this.types[item][i] == mimetype) {
					return item;
				}
			}
		}
		return null;
	},
	add: function (mimetype, extenions) {
		if (mimetypes[mimetype] !== undefined) {
			return;
		}
		if (typeof extenions === 'string') {
			extenions = [extenions];
		}
		mimetypes[mimetype] = extenions;
	}
};

module.exports = mime;