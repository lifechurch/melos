angular.module('api.bookmarks', [])

.factory('Bookmarks', ['RailsHttp', function(RailsHttp) {
	return {
		get: function(version, usfm) {
			var url = "/bookmarks/" + version + "/" + usfm;
			return RailsHttp.get(url, false);
		},

		create: function(bookmark, token) {
			return RailsHttp.post('/bookmarks', 'bookmark', token, bookmark);
		}
	};
}])

;