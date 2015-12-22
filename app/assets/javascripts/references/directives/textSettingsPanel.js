angular.module('reader.textSettingsPanel', [])

.directive("readerTextSettingsPanel", function() {
	return {
		restrict: 'A',
		scope: {
			fontSize: 				'=',
			fontFamily: 			'=',
			showFootnotes: 			'=',
			showCrossReferences: 	'=',
			showNumbersAndTitles: 	'=',
            togglePanel:            '='
		},
		templateUrl: '/reader-text-settings-panel.tpl.html',
		controller: ['$scope', 'UserSettings', function($scope, UserSettings) {
			angular.extend($scope, UserSettings.get("ReaderTextSettings"));

            $scope.cancel = function() {
                $scope.togglePanel('showReaderFont');
            };

			$scope.save = function() {
                $scope.togglePanel('showReaderFont');
				UserSettings.set("ReaderTextSettings", {
					fontSize: 					$scope.fontSize,
					fontFamily: 				$scope.fontFamily,
					showFootnotes:			$scope.showFootnotes,
					showCrossReferences: 	$scope.showCrossReferences,
					showNumbersAndTitles: 	$scope.showNumbersAndTitles
				});
			};
		}]
	}
})

;