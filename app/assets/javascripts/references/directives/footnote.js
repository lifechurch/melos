angular.module('reader.footnote', [])

.factory('FootnoteCounter', function() {
    var _notes = [];

    return {
        noteExists: function(key) {
            return _notes.indexOf(key) > -1;
        },

        addNote: function(key) {
            _notes.push(key);
        }
    };
})

.directive('note', [ 'FootnoteCounter', function(FootnoteCounter) {
	return {
		restrict: 'C',
		compile: function(tElement, tAttrs, transclude) {
            if (tElement[0] && tElement[0].children[1]) {
				tElement[0].innerHTML = "<a href='#' tooltips tooltip-speed='fast' tooltip-html='" + tElement[0].children[1].innerHTML + "'><img class='footnote-icon' src='/assets/footnote.png'></a>";
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
}])

;