angular.module('reader.bookmarkPanel', [])

.directive("readerBookmarkPanel", function() {
	return {
		restrict: 'A',
		scope: {
			selection: '=',
			version: '=',
			token: '=',
			bookmarks: '=',
			toggleSidePanel: '=',
			isLoggedIn: '='
		},
		templateUrl: '/reader-bookmark-panel.tpl.html',
		controller: ['$scope', '$element', 'Bookmarks', 'Highlights', '$timeout', function($scope, $element, Bookmarks, Highlights, $timeout) {
			$scope.success = false;

			if ($scope.selection && $scope.version && $scope.token) {
				$scope.bookmark 	= { labels: [] };
				$scope.colors 		= [];

				Highlights.getColors().success(function(data) {
					$scope.colors = data;
				}).error(function(err) {
					//TO-DO: Handle Error
				});

				$scope.submit = function(bookmarkForm) {
					$scope.success = false;

					var bookmark = {
						color: bookmarkForm.color,
						usfm_references: $scope.selection.join('+'),
						version_id: $scope.version,
						labels: bookmarkForm.labels,
						title: bookmarkForm.title
					};

					Bookmarks.create(bookmark, $scope.token).success(function(data) {
						var bookmarks = angular.copy($scope.bookmarks);
						bookmarks.push(data);
						$scope.bookmarks = bookmarks;
						$scope.success = true;
						$scope.bookmark = { labels: [] };
						$timeout(function() { 
							$scope.toggleSidePanel("showReaderBookmark"); 
							$scope.selection = [];
							$scope.success = false;
						}, 5000);
						
					}).error(function(err) {
						$scope.success = false;
						//TO-DO: Handle Error
					});
				};
			}
		}]
	}
})

;