angular.module('api.votd', [])

    .factory('Votd', ['RailsHttp', function(RailsHttp) {
        return {
            create: function(subscription) {
                return RailsHttp.post('/vod_subscriptions', null, null, subscription);
            }
        };
    }])

;