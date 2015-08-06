angular.module('reader.footnote', [])

.directive('note', function() {
	return {
		restrict: 'C',
		compile: function(tElement, tAttrs, transclude) {
			if (tElement[0] && tElement[0].children[1]) {
				tElement[0].innerHTML = "<a href='#' tooltips tooltip-side='bottom' tooltip-try='1' tooltip-scroll='true' tooltip-title='tip' tooltip-html='" + tElement[0].children[1].innerHTML + "'>N</a>";
			}
		},
		controller: ['$scope', '$element',  function($scope, $element) {
			$scope.$watch('showFootnotes', function(newVal, oldVal) {
				if(newVal) {
					$element.css("display", "inline");
				} else {
					$element.css("display", "none");
				}
			});
		}]
	}
})

;