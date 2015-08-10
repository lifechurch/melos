angular.module('yv', [
	'ui.router', 
	'ngSanitize', 
	'angular-cache',
	'ngMaterial',
	'yv.reader',
	'yv.moments',
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

;