angular.module("api.subscriptions", [])

.factory('Subscription', ['RailsHttp', function(RailsHttp) {
	return {
		update: function(username, planSlug, subscription, token) {
			return RailsHttp.put("/users/" + username + "/" + planSlug, 'subscription', token, subscription);
		}
	};
}])

;