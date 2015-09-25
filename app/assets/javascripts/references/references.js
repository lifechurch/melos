angular.module('yv.reader', [
	'reader.chapterList',
	'reader.versionList',
	'reader.reader',
	'reader.verseAction',
	'reader.highlightPanel',
	'reader.bookmarkPanel',
	'reader.notePanel',
	'reader.textSettingsPanel',
	'reader.audioPanel',
	'reader.verse',
	'reader.footnote',
	'reader.bookList',
	'api.highlights',
	'api.bookmarks',
	'api.versions',
	'api.notes',
	'api.bible',
	'720kb.tooltips'
])

.config([ '$stateProvider', function($stateProvider) {
	$stateProvider

	//Basic Reader
	.state('reader', {
		url: 				'/bible/:version/:usfm',
		controller: 			'ReaderCtrl',
		templateProvider: 	function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})

	//Bible Plan Sample Reader with Devo Content
	.state('planSample', {
		url: 				'/reading-plans/:plan/day/:day',
		controller: 			'ReaderCtrl',
		templateProvider: 	function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})	

	//Bible Plan for User
	.state('userPlan', {
		url: 				'/users/:username/reading-plans/:plan',
		controller: 			'ReaderCtrl',
		templateProvider: 	function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})	

	;
}])

.controller("ReaderCtrl", ["$scope", "$stateParams", "$location", "$rootScope", "$state", "$sce", "$timeout", "Highlights", "Bookmarks", "Notes", "Authentication", "Versions", "Bible", "UserSettings", "$window", function($scope, $stateParams, $location, $rootScope, $state, $sce, $timeout, Highlights, Bookmarks, Notes, Authentication, Versions, Bible, UserSettings, $window) {
	$scope.version 							= $stateParams.version;
	$scope.usfm 								= $stateParams.usfm;
	$scope.readerFontSize 			= 19;
	$scope.readerPlaybackSpeed 	= 1;
	$scope.versions 						= null;
	$scope.working 							= false;
	$scope.isLoggedIn 					= false;
	$scope.verseActionOpen 			= false;
	$scope.readerSelection 			= [];
	$scope.highlights 					= [];
	$scope.bookmarks 						= [];
	$scope.notes 								= [];
	$scope.isPlanState 					= $state.current.name == 'planSample';
	$scope.planContentReady			= false;
	$scope.month 								= 0;

	hideAllPanels();
	hideAllSidePanels();

	$scope.$watch('readerSelection.length', function(newVal, oldVal) {
		if (oldVal !== newVal) {
			if (newVal > 0) {
				$scope.verseActionOpen 	= true;
			} else {
				$scope.verseActionOpen 	= false;
			}
		}
	});


	/**
	 * Hide all the header panels
	 */
	function hideAllPanels() {
		$scope.showReaderAudio 			= false;
		$scope.showReaderFont 			= false;		
		$scope.showReaderBooks 			= false;
		$scope.showReaderVersions  	= false;
	}


	/**
	 * Hide all the side panels
	 */
	function hideAllSidePanels() {
		$scope.showReaderHighlight 	= false;		
		$scope.showReaderBookmark 	= false;	
		$scope.showReaderNote 			= false;
	}


	/**
	 * Load bible chapter from url path
	 */
	function loadChapter(location_path) {
		// Reset some scope vars
		$scope.working 						= true;
		$scope.showReaderBooks 		= false;
		$scope.showReaderChapters = false;
		$scope.readerSelection 		= [];		
		$scope.highlights 				= [];
		$scope.bookmarks 					= [];
		$scope.notes 							= [];

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

		if ($scope.isPlanState) {
			$scope.devotional_first_chapter = $scope.reader_html;
			$scope.reader_html = $scope.devotional_content;
			$scope.planContentReady = true;
		}

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

		Bookmarks.get($scope.version, $scope.usfm).success(function(data) {
			$scope.bookmarks = data;
		}).error(function(err) {
			//TO-DO: Handle Error
		});	

		// Notes.get($scope.version, $scope.usfm).success(function(data) {
		// 	$scope.notes = data;
		// }).error(function(err) {
		// 	//TO-DO: Handle Error
		// });			

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
						href: 	this_chapter.dataset.chapterHref,
						name: 	this_chapter.dataset.chapterNumber
					});
				}

				$scope.reader_book_list.push({
					usfm: 		reader_book_children[i].children[0].dataset.book,
					canon: 		reader_book_children[i].children[0].dataset.canon,
					name: 		reader_book_children[i].children[0].innerText.trim(),
					chapters: 	chapters
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
					abbrev: 	reader_version_children[i].dataset.abbrev,
					meta: 		reader_version_children[i].dataset.meta,
					title: 		reader_version_children[i].dataset.title,
					version: 	reader_version_children[i].dataset.version
				});
			}
		}
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
	 * Don't reload controller if navigating back to this same state, instead
	 * just make the new chapter call and switch the URL in the browser
	 */
	$rootScope.$on("YV:reloadState", function(event, stateInfo) {
			console.log(stateInfo);
		 	var toState 	= stateInfo[0]; 
		 	var toParams 	= stateInfo[1];

			// Fetch new data
			loadChapter($state.href(toState, toParams));

			// Switch to the new URL without loading the controller again
			$state.go(toState, toParams, { notify: false});

			// Get new scope values from params
			$scope.version 	= toParams.version;
			$scope.usfm 		= toParams.usfm;			
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