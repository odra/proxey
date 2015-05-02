'use strict';

var mime = {
	types: require('./mimetypes.json'),
	get: function (mimetype) {
		for (var item in  this.types) {
			if (this.types[item] == mimetype) {
				return item;
			}
		}
		return null;
	}
};

module.exports = mime;