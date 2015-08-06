angular.module('reader.reader',  [])

.directive("reader", ['UserSettings', function(UserSettings) {
	return {
		restrict: 'A',
		scope: {
			content: '=',
			selection: '=',
			fontSize: '=',
			fontFamily: '=',
			showFootnotes: '=',
			showCrossReferences: '=',
			showNumbersAndTitles: '=',
			highlights: '=',
			bookmarks: '='
		},
		controller: ["$scope",  function($scope) {
			angular.extend($scope, UserSettings.get("ReaderTextSettings"));

			$scope.verseHighlights = {};
			$scope.verseBookmarks = {};

			$scope.$watch('highlights', function(newVal, oldVal) {
				if (newVal && newVal.length) {
					for (var h = 0; h < $scope.highlights.length; h++) {
						var highlight = $scope.highlights[h];
						var references = highlight.references;
						for (var r = 0; r < references.length; r++) {
							var reference = references[r];
							for (var u = 0; u < reference.usfm.length; u++) {
								var usfm = reference.usfm[u];
								$scope.verseHighlights[usfm] = highlight.color;
							}
						}
					}
				}
			});

			$scope.$watch('bookmarks', function(newVal, oldVal) {
				if (newVal && newVal.length) {
					for (var h = 0; h < $scope.bookmarks.length; h++) {
						var bookmark = $scope.bookmarks[h];
						var references = bookmark.references;
						for (var r = 0; r < references.length; r++) {
							var reference = references[r];
							for (var u = 0; u < reference.usfm.length; u++) {
								var usfm = reference.usfm[u];
								$scope.verseBookmarks[usfm] = bookmark.color;
							}
						}
					}
				}
			});			
		}],
		templateUrl: '/reader.tpl.html'
	};
}])

;