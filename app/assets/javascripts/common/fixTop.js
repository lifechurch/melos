angular.module('common.fixTop', [])

.directive('fixTop', function() {
	return {
		restrict: 'A',
		controller: function($element, $window) {
			$element.css('position', 'relative');	
			$window.onscroll = function() {
				$element.css('top', $window.pageYOffset + "px");
			};
		}	
	};
})

;