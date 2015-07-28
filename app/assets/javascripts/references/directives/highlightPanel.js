angular.module('reader.highlightPanel', [])

.directive("readerHighlightPanel", function() {
	return {
		restrict: 'A',
		scope: {
			selection: '=',
			version: '=',
			token: '=',
			highlights: '=',
			toggleSidePanel: '='
		},
		templateUrl: '/reader-highlight-panel.tpl.html',
		controller: ['$scope', '$element', 'Highlights', function($scope, $element, Highlights) {
			if ($scope.selection && $scope.version && $scope.token) {
				$scope.highlight 	= {};
				$scope.colors 		= [];

				Highlights.getColors().success(function(data) {
					$scope.colors = data;
				}).error(function(err) {
					//TO-DO: Handle Error
				});

				$scope.submit = function(highlightForm) {
					var highlight = {
						color: highlightForm.color,
						usfm_references: $scope.selection.join('+'),
						version_id: $scope.version
					};

					Highlights.create(highlight, $scope.token).success(function(data) {
						var highlights = angular.copy($scope.highlights);
						highlights.push(data);
						$scope.highlights = highlights;
						$scope.toggleSidePanel("showReaderHighlight");
						$scope.selection = [];
					}).error(function(err) {
						//TO-DO: Handle Error
					});
				};
			}
		}]
	}
})

;