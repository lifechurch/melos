angular.module('reader.audioPanel', [])

.directive("readerAudioPanel", function() {
	return {
		restrict: 'A',
		scope: {
			audioData: '='
		},
        templateUrl: '/reader-audio-panel.tpl.html',
		controller: ['$scope', 'UserSettings', function($scope, UserSettings) {
			//TO-DO: Store Playback Speed and Other Audio-Related Settings
			//angular.extend($scope, UserSettings.get("ReaderTextSettings"));
			// $scope.save = function() {
			// 	UserSettings.set("ReaderTextSettings", {
			// 		playbackSpeed: $scope.playbackSpeed
			// 	});
			// };
		}]
	}
})

;