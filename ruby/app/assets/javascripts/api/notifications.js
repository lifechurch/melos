angular.module('api.notifications', [])

    .factory('Notifications', ['RailsHttp', function(RailsHttp) {
        return {
            get: function(length) {
                var url = "/notifications";
                return RailsHttp.get( url, false, { length: length } );
            }
        };
    }])

;