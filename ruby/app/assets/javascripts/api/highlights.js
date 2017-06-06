angular.module('api.highlights', [])

.factory('Highlights', ['RailsHttp', function(RailsHttp) {
	return {
		get: function(version, usfm) {
			var url = "/highlights/" + version + "/" + usfm;
			return RailsHttp.get(url, false);
		},

		getColors: function() {
			return RailsHttp.get("/highlights/colors", true);
		},

		create: function(highlight, token) {
			return RailsHttp.post('/highlights', 'highlight', token, highlight);
		}
	};
}])

;