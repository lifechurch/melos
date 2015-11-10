angular.module('yv', [
	'ui.router', 
	'ngSanitize', 
	'angular-cache',
	'ngMaterial',
	'yv.reader',
	'yv.moments',
	'yv.header',
    'yv.plans',
    'yv.catchAll',
	'api.authentication',
	'api.railsHttp',
	'common.fixTop',
	'common.userSettings'
])

.config([ '$locationProvider', '$urlRouterProvider', '$windowProvider', function($locationProvider, $urlRouterProvider, $windowProvider) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise(function($injector, $location) {
    });
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

.run(['$rootScope', '$window', '$location', function($rootScope, $window, $location) {
	// Intercept the stateChangeStart event, and determine if the whole state
	//  needs to be reloaded, or if we can just broadcast an event that lets
	//  the view know to reload data
	var stopListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if ((toState.name == fromState.name && (fromState.name == 'reader' || fromState.name == 'planSample' || fromState.name == 'userPlan')) || fromState.name == "") {
            if (fromState.name !== "") {
                event.preventDefault();
                $rootScope.$broadcast("YV:reloadState", [toState, toParams]);
            }
        }else if (fromState.name && toState.name && fromState.name !== toState.name) {
            $window.location.href = $location.url();
        }else if (fromState.name && toState.name == 'plans') {
            $window.location.href = $location.url();
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