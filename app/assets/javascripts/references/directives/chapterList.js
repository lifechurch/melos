angular.module('reader.chapterList', [])

.directive("readerChapterList", function() {
	return {
		restrict: 'A',
		scope: {
			selectedBook: '=',
            toggleChaptersPanel: '='
		},
		controller: ["$scope", function($scope) {
            $scope.cancel = function() {
                $scope.toggleChaptersPanel();
            };
		}],
		templateUrl: '/reader-chapter-selector.tpl.html'
	};
})

;