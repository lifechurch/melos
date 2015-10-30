angular.module("api.subscriptions", [])

.factory('Subscription', ['RailsHttp', function(RailsHttp) {
	return {
        create: function(userPlanUrl, planId, privacy, token) {
          var url = userPlanUrl + "?plan_id=" + planId + "&privacy=" + privacy;
          return RailsHttp.post(url, null, token, null);
        },
		update: function(username, planSlug, subscription, token) {
			return RailsHttp.put("/users/" + username + "/" + planSlug, 'subscription', token, subscription);
		}
	};
}])

;