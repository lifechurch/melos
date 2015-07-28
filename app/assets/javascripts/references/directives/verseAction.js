angular.module('reader.verseAction', [])

.directive("verseAction", function() {
	return {
		restrict: 'A',
		scope: {
			selection: '=',
			isOpen: '=',
			toggleSidePanel: '='
		},
		templateUrl: '/reader-verse-action.tpl.html'
	}
})

;