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
		templateUrl: '/reader-verse-action.tpl.html'
	}
})

;