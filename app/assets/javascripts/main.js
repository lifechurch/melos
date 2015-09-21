angular.module('yv', [
	'ui.router', 
	'ngSanitize', 
	'angular-cache',
	'ngMaterial',
	'yv.reader',
	'yv.moments',
	'yv.header',
	'api.authentication',
	'api.railsHttp',
	'common.fixTop',
	'common.userSettings'
])

.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
}])

.directive('ngHtmlCompile', function($compile) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.$watch(attrs.ngHtmlCompile, function(newValue, oldValue) {
				element.html(newValue);
				$compile(element.contents())(scope);
			});
		}
	};
})

.run(['$rootScope', '$window', function($rootScope, $window) {

	// Intercept the stateChangeStart event, and determine if the whole state 
	//  needs to be reloaded, or if we can just broadcast an event that lets
	//  the view know to reload data
	var stopListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {		
		if ((toState.name == fromState.name && fromState.name == 'reader') || fromState.name == "") {
			if (fromState.name !== "") {
				event.preventDefault();
				$rootScope.$broadcast("YV:reloadState", [toState, toParams]);
			}
		}
	});

	//This is hacky, need to find a better way
	//  Need a way to take an absolute URL and
	//  resolve it to a state name
	var stopLCSListener = $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl, newState, oldState) {
		var oldBaseRoute = oldUrl.split('/')[3];
		var newBaseRoute = newUrl.split('/')[3];
		var oldUserBaseRoute = oldUrl.split('/')[5] || true;
		var newUserBaseRoute = newUrl.split('/')[5] || true;
		if(oldBaseRoute !== newBaseRoute || oldUserBaseRoute !== newUserBaseRoute) {
			event.preventDefault();
			$window.location.href = newUrl;
		}
	});
}])

;