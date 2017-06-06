angular.module("api.likes", [])

.factory('Like', ['RailsHttp', function(RailsHttp) {
	return {
		create: function(id, token) {
			return RailsHttp.post("/likes", null, token, { moment_id: id });
		},

		delete: function(id, token) {
			return RailsHttp.delete("/likes/" + id, token);
		}
	};
}])

;
