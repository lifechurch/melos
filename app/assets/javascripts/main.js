angular.module('yv', [
	'ui.router', 
	'ngSanitize', 
	'angular-cache',
	'ngMaterial',
	'yv.reader',
	'yv.moments',
	'yv.header',
    'yv.plans',
    'yv.plans.saveForLater',
	'api.authentication',
	'api.railsHttp',
	'common.fixTop',
    'common.fixBottom',
	'common.userSettings',
    'common.recentVersions',
    'common.skipHome',
    'videos.videoPlayer',
    'common.installCounter',
    'common.branchMobileBanner',
    'common.branchSms',
    'common.hoverLink',
    'common.focusMe',
    'common.carousel',
    'yv.friendships.addFriend',
    'yv.search'
])

.config([ '$locationProvider', '$urlRouterProvider', '$windowProvider', function($locationProvider, $urlRouterProvider, $windowProvider) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
}])

.directive('ngHtmlCompile', ['$compile', function($compile) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.$watch(attrs.ngHtmlCompile, function(newValue, oldValue) {
				element.html(newValue);
				$compile(element.contents())(scope);
			});
		}
	};
}])

.run(['$rootScope', '$window', '$location', '$anchorScroll', '$log', '$interval', function($rootScope, $window, $location, $anchorScroll, $log, $interval) {
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
	});
    $window.scrollWatchEnabled = true;

    $window.onresize = function() {
        $rootScope.$broadcast("Scroll", []);
    }

    $interval(function() {
        $rootScope.$broadcast("Scroll", []);
    }, 500);

    $window.onscroll = function() {
        if (!$window.scrollWatchEnabled) {
            return;
        }

        $window.scrollWatchEnabled = false;
        $rootScope.$broadcast("Scroll", []);

        return setTimeout(function() {
            $window.scrollWatchEnabled = true;
        }, 10);
    }
}])

;