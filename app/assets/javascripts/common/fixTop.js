angular.module('common.fixTop', [])

.directive('fixTop', function() {
	return {
		restrict: 'A',
		controller: ['$element', '$window', '$rootScope', function($element, $window, $rootScope) {
			$element.css('position', 'relative');
            $element.css('z-index', '100');
            $rootScope.$on('Scroll', function() {
				$element.css('top', $window.pageYOffset + "px");
			});
		}]
	};
})

;