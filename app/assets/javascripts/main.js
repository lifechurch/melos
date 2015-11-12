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
	'common.userSettings',
    'common.recentVersions'
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

.run(['$rootScope', '$window', '$location', '$anchorScroll', function($rootScope, $window, $location, $anchorScroll) {

    $anchorScroll.yOffset = 150;

	// Intercept the stateChangeStart event, and determine if the whole state
	//  needs to be reloaded, or if we can just broadcast an event that lets
	//  the view know to reload data
	var stopListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var statesToIntercept = [ 'reader', 'reader-locale', 'planSample', 'planSample-locale', 'userPlan', 'userPlan-locale'];
        if (statesToIntercept.indexOf(toState.name) > -1 && toState.name == fromState.name) {
            event.preventDefault();
            $rootScope.$broadcast("YV:reloadState", [toState, toParams]);
        }
//        } else if(fromState.name == "" && toState.name == "") {
//            console.log("no to or from state");
//        } else if(fromState.name == "") {
//            console.log("no from state");
//        } else if(toState.name == "") {
//            console.log("no to state");
//        } else {
//            console.log("just ignore");
//        }
	});

	var stopLCSListener = $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl, newState, oldState) {
        var urlHasChanged = newUrl !== oldUrl;

        var firstSegmentOld = getFirst(oldUrl.replace(window.location.origin, ''));
        var firstSegmentNew = getFirst(newUrl.replace(window.location.origin, ''));

        var segmentChanged = firstSegmentNew != firstSegmentOld;

        var isVideos = urlHasChanged && isFirst('videos', newUrl.replace(window.location.origin, ''));
        var isPlans = urlHasChanged && isFirst('reading-plans', newUrl.replace(window.location.origin, ''));
        var isUserPlans = urlHasChanged && isFirst('users', newUrl.replace(window.location.origin, '')) && inPathNotFirst('reading-plans', newUrl.replace(window.location.origin, ''));

        if (segmentChanged || isVideos || isUserPlans || isPlans) {
			event.preventDefault();
			$window.location.href = newUrl;
        }
	});
}])

;