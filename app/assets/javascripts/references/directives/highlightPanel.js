angular.module('reader.highlightPanel', [])

.directive("readerHighlightPanel", function() {
	return {
		restrict: 'A',
		scope: {
			selection: '=',
			version: '=',
			token: '=',
			highlights: '='
		},
		templateUrl: '/reader-highlight-panel.tpl.html',
		controller: ['$scope', '$element', 'RailsHttp', function($scope, $element, RailsHttp) {
			if ($scope.selection && $scope.version && $scope.token) {
				$scope.highlight = {};
				$scope.colors = [];

				RailsHttp.get("/highlights/colors", true)
				
				.success(function(data) {
					$scope.colors = data;
				})

				.error(function(err) {

				});

				$scope.submit = function(highlight) {
					RailsHttp.post('/highlights', 'highlight', $scope.token, {
						color: highlight.color,
						usfm_references: $scope.selection.join('+'),
						version_id: $scope.version
					})

					.success(function(data) {
						var highlights = angular.copy($scope.highlights);
						highlights.push(data);
						$scope.highlights = highlights;
					})

					.error(function(err) {
						//TO-DO: Handle Error
					});
				};
			}
		}]
	}
})

;