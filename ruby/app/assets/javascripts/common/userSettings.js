angular.module('common.userSettings', [])

.factory('UserSettings', [function() {
	var key = "YouVersionUserSettings";
	var settings = JSON.parse(localStorage.getItem(key)) || {};

	function save() {
		localStorage.setItem(key, JSON.stringify(settings));
	}

	return {
		remove: function(name) {
			delete settings[name];
			save();
		},
		set: function(name, value) {
			settings[name] = value;
			save();
		},
		get: function(name) {
			return settings[name];
		}		
	};
}])

;