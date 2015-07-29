angular.module('yv.reader', [ 
	'reader.chapterList',
	'reader.versionList',
	'reader.reader',
	'reader.verseAction',
	'reader.highlightPanel',
	'reader.textSettingsPanel',
	'reader.audioPanel',
	'reader.verse',
	'reader.bookList',
	'api.highlights',
	'api.versions',
	'api.bible'
])

.config([ '$stateProvider', function($stateProvider) {
	$stateProvider
	.state('reader', {
		url: '/bible/:version/:usfm',
		controller: 'ReaderCtrl',
		templateProvider: function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})
	;
}])

.controller("ReaderCtrl", ["$scope", "$stateParams", "$location", "$rootScope", "$state", "$sce", "$timeout", "Highlights", "Authentication", "Versions", "Bible", "UserSettings", function($scope, $stateParams, $location, $rootScope, $state, $sce, $timeout, Highlights, Authentication, Versions, Bible, UserSettings) {
	$scope.version 					= $stateParams.version;
	$scope.usfm 						= $stateParams.usfm;
	$scope.readerFontSize 			= 19;
	$scope.readerPlaybackSpeed 	= 1;
	$scope.versions 					= null;
	$scope.working 					= false;
	$scope.isLoggedIn 				= false;
	$scope.verseActionOpen 			= false;
	$scope.readerSelection 			= [];
	$scope.highlights 					= [];

	hideAllPanels();
	hideAllSidePanels();

	$scope.$watch('readerSelection.length', function(newVal, oldVal) {
		if (oldVal !== newVal) {
			if (newVal > 0) {
				$scope.verseActionOpen = true;
			} else {
				$scope.verseActionOpen = false;
			}
		}
	});


	/**
	 * Hide all the header panels
	 */
	function hideAllPanels() {
		$scope.showReaderAudio 	= false;
		$scope.showReaderFont 		= false;		
		$scope.showReaderBooks 	= false;
	}


	/**
	 * Hide all the side panels
	 */
	function hideAllSidePanels() {
		$scope.showReaderHighlight 	= false;		
	}


	/**
	 * Load bible chapter from url path
	 */
	function loadChapter(location_path) {

		// Reset some scope vars
		$scope.working 				= true;
		$scope.showReaderBooks 	= false;
		$scope.showReaderChapters = false;
		$scope.readerSelection 		= [];		
		$scope.highlights 				= [];

		Bible.getChapter(location_path).success(function(data, status, headers, config) {
			fillScope(data);
			$scope.working = false;
		}).error(function(data, status, headers, config) {
			//TO-DO: Handle Error!
			$scope.working = false;			
		});
	}


	/**
	 * Fetch list of versions from server 
	 */
	function loadVersions() {
		Versions.get($scope.version).success(function(data, status, headers, config) {
			fillScope(data);
			$scope.working = false;
		}).error(function(data, status, headers, config) {
			//TO-DO: Handle Error!
			$scope.working = false;			
		});
	}


	/**
	 * Take all the key/value pairs from an
	 *  object and make them available as 
	 *  part of $scope
	 */
	function fillScope(newScope) {
		angular.extend($scope, newScope);

		//TO-DO: Make Audio Directive
		if ($scope.reader_audio && $scope.reader_audio.url) {
			var player = document.getElementById("reader_audio_player");
			player.src = $sce.trustAsResourceUrl($scope.reader_audio.url);
		}

		Highlights.get($scope.version, $scope.usfm).success(function(data) {
			$scope.highlights = data;
		}).error(function(err) {
			//TO-DO: Handle Error
		});

	}


	/**
	 * Get list of books for this version from 
	 *  the HTML generated server-side
	 */
	function parseBookLinks() {
		if (!$scope.reader_book_list || $scope.reader_book_list.length == 0) {
			var reader_book_children = angular.element(document.getElementById("reader_book_list")).children();
			$scope.reader_book_list = [];
			for (var i = 0; i < reader_book_children.length; i++) {
				
				var chapters = [];
				var reader_book_child_chapters = angular.element(reader_book_children[i].children[1]).children();
				for (var c = 0; c < reader_book_child_chapters.length; c++) {
					var this_chapter = reader_book_child_chapters[c];
					chapters.push({
						href: this_chapter.dataset.chapterHref,
						name: this_chapter.dataset.chapterNumber
					});
				}

				$scope.reader_book_list.push({
					usfm: reader_book_children[i].children[0].dataset.book,
					canon: reader_book_children[i].children[0].dataset.canon,
					name: reader_book_children[i].children[0].innerText.trim(),
					chapters: chapters
				});
			}
		}
	}

	function parseVersionLinks() {
		if (!$scope.reader_version_list || $scope.reader_version_list.length == 0) {
			var reader_version_children = angular.element(document.getElementById("reader_version_list")).children();
			$scope.reader_version_list = [];
			for (var i = 0; i < reader_version_children.length; i++) {
				$scope.reader_version_list.push({
					abbrev: reader_version_children[i].dataset.abbrev,
					meta: reader_version_children[i].dataset.meta,
					title: reader_version_children[i].dataset.title,
					version: reader_version_children[i].dataset.version
				});
			}
		}
		console.log($scope.reader_version_list);
	}	


	/**
	 * Use this method to toggle header panels
	 * Possible values are:
	 *  - showReaderFont
	 *  - showReaderAudio
	 *  - showReaderBooks
	 *  - showReaderChapters
	 */
	$scope.togglePanel = function(panel) {
		var originalValue = $scope[panel];
		hideAllPanels();
		$scope[panel] = !originalValue;

		if ((panel == "showReaderFont" || panel == "showReaderAudio") && $scope[panel]) {

		} else if (panel == "showReaderBooks") {
			$scope.selectedBook = null;
			parseBookLinks();
		} else if (panel == "showReaderChapters") {
			parseBookLinks();
			if (!$scope.selectedBook) {
				$scope.showReaderChapters 	= false;
				$scope.showReaderBooks 		= true;
			}			
		} else if (panel == "showReaderVersions") {
			parseVersionLinks();
		}
	};


	/**
	 * Use this method to toggle side panels
	 * Possible values are:
	 *  - showHighlightPanel
	 */
	$scope.toggleSidePanel = function(panel) {
		var originalValue = $scope[panel];
		hideAllSidePanels();
		$scope[panel] = !originalValue;
	};


	/**
	 * This panel has its own toggle method so
	 * we can ensure a book has been selected
	 * before opening book panel
	 */
	$scope.toggleChaptersPanel = function(book) {
		$scope.selectedBook = book;
		$scope.togglePanel("showReaderChapters");
	};


	// Load data from page variable or ajax
	if (TEMPLATE_FROM_RAILS.hasOwnProperty($location.path())) {
		fillScope(TEMPLATE_FROM_RAILS[$location.path()]);
	} else {
		loadChapter($location.path());
	}


	/**
	 * Don't reload controller of navigating back to this same state, instead
	 * just make the new chapter call and switch the URL in the browser
	 */
	var stopListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if (toState.name == fromState.name) {

			// Stop State Change
			event.preventDefault();

			// Get new scope values from params
			$scope.version 	= toParams.version;
			$scope.usfm 		= toParams.usfm;

			// Fetch new data
			loadChapter($state.href(toState, toParams));

			// Switch to the new URL without loading the controller again
			$state.go(toState, toParams, { notify: false});			

		} else {

			// If we're going somewhere else, disconnect this listener
			stopListener();
		}
	});


	Authentication.isLoggedIn('/isLoggedIn').success(function(data) {
		if (data === true) {
			$scope.isLoggedIn = true;
		}
	}).error(function(data) {
		//TO-DO: Handle Error
	});
}])

;