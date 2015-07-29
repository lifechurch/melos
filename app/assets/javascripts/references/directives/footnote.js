angular.module('reader.footnote', [])

.directive('note', function() {
	return {
		restrict: 'C',
		compile: function(tElement, tAttrs, transclude) {
			tElement[0].innerHTML = "<a href='#' tooltips tooltip-side='bottom' tooltip-try='1' tooltip-scroll='true' tooltip-title='tip' tooltip-html='" + tElement[0].children[1].innerHTML + "'>N</a>";
		},
		controller: ['$scope', '$element',  function($scope, $element) {

			// var toolTipBody = angular.element($element[0].children[1]).html();

			// //var label = angular.element($element[0].children[0]);
			// var body = angular.element($element[0].children[1]);

			// var html = "<a href='#' tooltips tooltip-title='" + body.html() + "'>N</a>";
			// $element.html(html);

				//label.addClass("ng-hide");
				// body.addClass("tooltip");
				// body.css("display", "none");
				// //body.remove();
				// //label.remove();

				// //label.removeClass("ng-hide");
				// label.on('click', function(event) {
				// 	event.preventDefault();
				// 	console.log(event.pageX, event.pageY);
				// 	body.css("left", event.pageX + "px");
				// 	body.css("top", event.pageY + "px");
				// 	body.css("bottom", "auto");
				// 	body.css("right", "auto");
				// 	if (body.css("display") == "none") {
				// 		body.css("display", "inline");
				// 	} else {
				// 		body.css("display", "none");					
				// 	}
				// });

				// label.attr("data-tooltip", true);
				// label.attr("aria-haspopup", "true");
				// label.addClass("has-tip");
				// label.html("<b>N</b>");

			// $scope.$watch('showFootnotes', function(newVal, oldVal) {
			// 	if(newVal) {
			// 		$element.css("display", "inline");
			// 	} else {
			// 		$element.css("display", "none");
			// 	}
			// });
		}]
	}
})

;