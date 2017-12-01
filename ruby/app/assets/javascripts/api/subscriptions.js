angular.module("api.subscriptions", [])

.factory('Subscription', ['RailsHttp', function(RailsHttp) {
	return {
        create: function(userPlanUrl, planId, privacy, token) {
          var url = userPlanUrl + "?plan_id=" + planId + "&privacy=" + privacy;
          return RailsHttp.post(url, null, token, null);
        },
        saveForLater: function(userPlanUrl, planId) {
            var url = userPlanUrl + "/save-for-later?plan_id=" + planId;
            return RailsHttp.post(url, null, null, null);
        },
        removeSaved: function(userPlanUrl, planId) {
            var url = userPlanUrl + "/remove-saved?plan_id=" + planId;
            return RailsHttp.post(url, null, null, null);
        },
		update: function(username, planSlug, subscription, token) {
			return RailsHttp.put("/users/" + username + "/" + planSlug, 'subscription', token, subscription);
		},
        completeReference: function(userPlanUrl, usfm, version, dayTarget, token) {
            var postData = {
                ref: usfm,
                completed: true,
                version: version,
                day_target: dayTarget,
                completion: 'on'
            };
            return RailsHttp.put(userPlanUrl, null, token, postData);
        },

        getRefs: function(userPlanUrl, day, planId) {
            return RailsHttp.get(userPlanUrl, false, { day: day, id: planId });
        }
	};
}])

;