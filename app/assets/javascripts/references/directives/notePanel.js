angular.module('reader.notePanel', [])

.directive("readerNotePanel", function() {
	return {
		restrict: 'A',
		scope: {
			selection: '=',
			version: '=',
			token: '=',
			notes: '=',
			toggleSidePanel: '=',
			isLoggedIn: '='
		},
		templateUrl: '/reader-note-panel.tpl.html',
		controller: ['$scope', '$element', 'Notes', 'Highlights', '$timeout', function($scope, $element, Notes, Highlights, $timeout) {
			$scope.success = false;

			if ($scope.selection && $scope.version && $scope.token) {
				$scope.note		= {};
				$scope.colors 		= [];

				Highlights.getColors().success(function(data) {
					$scope.colors = data;
				}).error(function(err) {
					//TO-DO: Handle Error
				});

				$scope.submit = function(noteForm) {
					$scope.success = false;

					var note = {
						color: noteForm.color,
						usfm_references: $scope.selection.join('+'),
						version_id: $scope.version,
						content: noteForm.content,
						title: noteForm.title
					};

					Notes.create(note, $scope.token).success(function(data) {
						var notes = angular.copy($scope.notes);
						notes.push(data);
						$scope.notes = notes;
						$scope.success = true;
						$scope.note = {};
						$timeout(function() { 
							$scope.toggleSidePanel("showReaderNote"); 
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