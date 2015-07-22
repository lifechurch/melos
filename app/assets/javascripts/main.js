angular.module('yv', [
	'yv.references'
])

.config([ '$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
	$stateProvider
	.state('reader', {
		url: '/bible/:version/:usfm',
		controller: 'ReaderCtrl',
		templateProvider: function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})
	;
}])

;