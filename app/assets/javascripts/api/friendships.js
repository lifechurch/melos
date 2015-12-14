angular.module('api.friendships', [])

    .factory('Friendships', ['RailsHttp', function(RailsHttp) {
        return {
            get: function() {
                var url = "/friendships/requests";
                return RailsHttp.get( url, false);
            },

            accept: function(id, token) {
                return RailsHttp.post('/friendships?user_id=' + id, 'friendship', token, null);
            },

            offer: function(path, token) {
                return RailsHttp.post(path, 'friendship', token, null);
            },

            deny: function(id, token) {
                return RailsHttp.delete('/friendships?user_id=' + id, token);
            }
        };
    }])

;