angular.module('api.railsHttp', [])

.factory('RailsHttp', ['$http', 'CacheFactory', '$stateParams', function($http, CacheFactory, $stateParams) {
	CacheFactory('dataCache', {
		maxAge: 15 * 60 * 1000, 				// Items added to this cache expire after 15 minutes
		cacheFlushInterval: 60 * 60 * 1000, 	// This cache will clear itself every hour
		deleteOnExpire: 'aggressive', 			// Items will be deleted from this cache when they expire
		storageMode: 'localStorage'			// Use LocalStorage in browser
	});	

	function jsonToForm(o, name, token) {
		var f = "authenticity_token=" + token;
		for (var key in o) {
			if (o.hasOwnProperty(key)) {
				if (name === null) {
					f += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(o[key]);
				} else {
					f += "&" + encodeURIComponent(name + "[" + key + "]") + "=" + encodeURIComponent(o[key]);					
				}

			}
		}
		return f;
	}

    function prefixLocale(path) {
        if ($stateParams.hasOwnProperty('locale')) {
            var parts = path.split("/");
            if (parts[1] == $stateParams.locale) {
                return path;
            } else {
                return "/" + $stateParams.locale + path;
            }
        } else {
            return path;
        }
    }

	return {
		get: function(path, cache, params) {
			return $http.get(prefixLocale(path) + ".json", { params: params, cache: cache? CacheFactory.get('dataCache') : false, responseType: 'json', headers: { 'Accept' : 'application/json' } })

			.success(function(data) {

			})

			.error(function(err) {
				//TO-DO: Handle Error
			});
		},

		post: function(path, name, token, data) {
			return $http.post( prefixLocale(path), jsonToForm(data, name, token), {responseType: 'json', headers: {'Accept' : 'application/json, text/javascript, *.*', 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-Token': token}})

			.success(function(data) {

			})

			.error(function(err) {
				//TO-DO: Handle Error
			});
		},

		put: function(path, name, token, data) {
			return $http.put( prefixLocale(path), jsonToForm(data, name, token), {responseType: 'json', headers: {'Accept' : 'application/json, text/javascript, *.*', 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-Token': token}})

			.success(function(data) {

			})

			.error(function(err) {
				//TO-DO: Handle Error
			});
		},		

		delete: function(path, token) {
			return $http.delete( prefixLocale(path), {responseType: 'json', headers: {'Accept' : 'application/json, text/javascript, *.*', 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-Token': token}})

			.success(function(data) {

			})

			.error(function(err) {
				//TO-DO: Handle Error
			});
		}		
	}
}])

;