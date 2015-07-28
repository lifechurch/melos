angular.module('reader.audioPanel', [])

.directive("readerAudioPanel", function() {
	return {
		restrict: 'A',
		scope: {
			audioData: '='
		},
		template: angular.element(document.getElementById("reader-audio-panel")).html(),
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