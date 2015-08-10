angular.module("api.bible", [])

.factory('Bible', ['RailsHttp', function(RailsHttp) {
	return {
		getChapter: function(path) {
			return RailsHttp.get(path, true);
		},
		getVerse: function(usfm, version) {
			var url = "/bible/" + version + "/" + usfm + ".json";
			return RailsHttp.get(url, true);
		}
	};
}])

;
