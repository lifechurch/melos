var	express = require('express'),
		router = express.Router(),
		fs = require('fs');

router.get('/ping', function(req, res) {
	res.status(200).send();
});

router.get('/running', function(req, res) {
	fs.stat('/tmp/disable.txt', function(err, stats) {
		if (!err) {
			res.status(404).send();
		} else {
			res.status(200).send();
		}
	});
});

module.exports = router;