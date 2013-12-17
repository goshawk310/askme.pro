'use strict';

module.exports = {
	handler: {
		db: function db(err, res) {
			return res.send(500, err);
		}
	}
};