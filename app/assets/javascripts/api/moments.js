angular.module("api.moments", [])

.factory('Moments', ['RailsHttp', function(RailsHttp) {
	return {
		get: function(page) {
			var url = "/moments/_cards.json";
			return RailsHttp.get(url, false, { page: page });
		}
	};
}])

;