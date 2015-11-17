angular.module('api.versions', [])

.factory('Versions', ['RailsHttp', function(RailsHttp) {
	return {
		get: function(version, singleLocale) {
			return 	RailsHttp.get('/versions', true, { "context_version": version, "single_locale": singleLocale });
		},
        getSingle: function(versionId) {
            return RailsHttp.get('/versions/' + versionId.toString(), true, {});
        }
	};
}])

;