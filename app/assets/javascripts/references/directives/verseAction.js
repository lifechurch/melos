angular.module('reader.verseAction', [])

.directive("verseAction", function() {
	return {
		restrict: 'A',
		scope: {
			selection: '=',
            selectionText: '=',
			isOpen: '=',
			toggleSidePanel: '=',
            panelIsOpen: '='
		},
		templateUrl: '/reader-verse-action.tpl.html',
        controller: ['$scope', '$rootScope', function($scope, $rootScope) {
            $scope.$watch('isOpen', function(newVal, oldVal) {
                if (newVal == false && !$scope.panelIsOpen) {
                    $rootScope.$emit('ClearVerseSelection');
                }
            });
        }]
	}
})

;