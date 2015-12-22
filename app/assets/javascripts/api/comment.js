angular.module("api.comments", [])

.factory('Comment', ['RailsHttp', function(RailsHttp) {
	return {
		create: function(id, content, token) {
			return RailsHttp.post("/comments", "comment", token, { moment_id: id, content: content });
		},

		delete: function(id, token) {
			return RailsHttp.delete("/comments/" + id, token);
		}
	};
}])

;