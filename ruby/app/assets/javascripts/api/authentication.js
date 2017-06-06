angular.module('api.authentication', [])

.factory('Authentication', [ 'RailsHttp', function(RailsHttp) {
	return {
		isLoggedIn: function() {
			return RailsHttp.get('/isLoggedIn', false);
		}
	};
}])

;