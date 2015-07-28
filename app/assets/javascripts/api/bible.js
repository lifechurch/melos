angular.module("api.bible", [])

.factory('Bible', ['RailsHttp', function(RailsHttp) {
	return {
		getChapter: function(path) {
			return RailsHttp.get(path, true);
		}
	};
}])

;
