angular.module('api.notes', [])

.factory('Notes', ['RailsHttp', function(RailsHttp) {
	return {
		get: function(version, usfm) {
			var url = "/notes/" + version + "/" + usfm;
			return RailsHttp.get(url, false);
		},

		create: function(note, token) {
			return RailsHttp.post('/notes', 'note', token, note);
		}
	};
}])

;