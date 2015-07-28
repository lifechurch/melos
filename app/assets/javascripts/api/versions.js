angular.module('api.versions', [])

.factory('Versions', ['RailsHttp', function(RailsHttp) {
	return {
		get: function(version) {
			return 	RailsHttp.get('/versions', true, { "context_version": version });
		}
	};
}])

;