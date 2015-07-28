angular.module('reader.chapterList', [])

.directive("readerChapterList", function() {
	return {
		restrict: 'A',
		scope: {
			selectedBook: '='
		},
		controller: ["$scope", function($scope) {	
		}],
		templateUrl: '/reader-chapter-selector.tpl.html'
	};
})

;