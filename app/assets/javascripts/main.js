angular.module('yv', [
	//'rzModule',
	'ngMaterial',
	'yv.references'
])

.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
}])

;