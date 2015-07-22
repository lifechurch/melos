angular.module('yv', [
	'rzModule',
	'yv.references'
])

.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
}])

;