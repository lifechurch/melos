angular.module('reader.verse', [])

.directive("verse", function() {
	return {
		restrict: 'C',
        controller: ["$rootScope", "$element", "$scope", function($rootScope, $element, $scope) {
          $rootScope.$on("ClearVerseSelection", function() {
              $element.removeClass("selected");
          });
        }],
		link: function(scope, element) {
			scope.$watch("verseHighlights['" + element[0].dataset.usfm + "']", function(newVal, oldVal) {
				if (newVal) {
					element.css("background-color", "#" + newVal);
				}
			});

			scope.$watch("verseBookmarks['" + element[0].dataset.usfm + "']", function(newVal, oldVal) {
				if (newVal) {
					element.css("background-color", "#" + newVal);
				}
			});			

			element.on('mouseup', function(event) {
				element.toggleClass("selected");
				if (!scope.selection) {
					scope.selection = [];
				}
                if (!scope.selectionText) {
                    scope.selectionText = [];
                }
				scope.$apply(function() { 
					if (element.hasClass("selected")) {
						scope.selection.push(element[0].dataset.usfm);
                        scope.selectionText.push(element.text());
					} else {
						scope.selection.splice(scope.selection.indexOf(element[0].dataset.usfm), 1);
                        scope.selectionText.splice(scope.selectionText.indexOf(element.text()), 1);
					}
				});
			});
		}
	};
})

;