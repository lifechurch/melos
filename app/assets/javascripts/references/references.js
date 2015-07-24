angular.module('yv.references', [ 'ui.router', 'ngSanitize' ])

.config([ '$stateProvider', function($stateProvider) {
	$stateProvider
	.state('reader', {
		url: '/bible/:version/:usfm',
		controller: 'ReaderCtrl',
		templateProvider: function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})
	;
}])

.controller("ReaderCtrl", ["$scope", "$stateParams", "$location", "$http", "$rootScope", "$state", "$sce", "$rootScope", "$timeout", function($scope, $stateParams, $location, $http, $rootScope, $state, $sce, $rootScope, $timeout) {
	$scope.version = $stateParams.version;
	$scope.usfm = $stateParams.usfm;
	$scope.readerFontSize = 19;
	$scope.readerPlaybackSpeed = 1;
	$scope.working = false;

	hideAllPanels();

	function hideAllPanels() {
		$scope.showReaderAudio = false;
		$scope.showReaderFont = false;		
		$scope.showReaderBooks = false;
	}

	$scope.togglePanel = function(panel) {
		var originalValue = $scope[panel];
		hideAllPanels();
		$scope[panel] = !originalValue;

		if ((panel == "showReaderFont" || panel == "showReaderAudio") && $scope[panel]) {
			$timeout(function() {
				$rootScope.$broadcast('reCalcViewDimensions');			
			}, 50);
		} else if (panel == "showReaderBooks") {
			$scope.selectedBook = null;			
			parseBookLinks();
		} else if (panel == "showReaderChapters") {
			parseBookLinks();			
			if (!$scope.selectedBook) {
				$scope.showReaderChapters = false;
				$scope.showReaderBooks = true;
			}			
		}
	};

	$scope.toggleChaptersPanel = function(book) {
		$scope.selectedBook = book;
		console.log("Chapter Show", $scope.selectedBook);
		$scope.togglePanel("showReaderChapters");
	};

	function loadChapter(location_path) {
		$scope.working = true;
		$scope.showReaderBooks = false;
		$scope.showReaderChapters = false;		

		$http.get(location_path, { cache: true, responseType: 'json', headers: { 'Accept' : 'application/json' } })

		.success(function(data, status, headers, config) {
			fillScope(data);
			$scope.working = false;
		})

		.error(function(data, status, headers, config) {
			//TO-DO: Handle Error!
			$scope.working = false;			
		});
	}

	function fillScope(newScope) {
		angular.extend($scope, newScope);
		if ($scope.reader_audio && $scope.reader_audio.url) {
			var player = document.getElementById("reader_audio_player");
			player.src = $sce.trustAsResourceUrl($scope.reader_audio.url);
			//player.load();
			//player.playbackRate = 2;
		}
	}

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
					name: reader_book_children[i].children[0].innerText.trim(),
					chapters: chapters
				});
			}
		}
	}

	if (TEMPLATE_FROM_RAILS.hasOwnProperty($location.path())) {
		fillScope(TEMPLATE_FROM_RAILS[$location.path()]);
	} else {
		loadChapter($location.path());
	}

	var stopListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if (toState.name == fromState.name) {
			event.preventDefault();
			loadChapter($state.href(toState, toParams));
		} else {
			stopListener();
		}
	});	
}])

.directive("readerChapterList", function() {
	return {
		restrict: 'A',
		scope: {
			selectedBook: '='
		},
		controller: ["$scope", function($scope) {	
		}],
		templateUrl: '/reader-chapter-selector.tpl.html'
	};
})

.directive("readerBookList", function() {
	return {
		restrict: 'A',
		scope: {
			books: '=',
			booksPerColumn: '=',
			maxColumns: '=',
			displayMode: '=', //traditional or alphabetic/
			filter: '=',
			sort: '=',
			version: '=',
			selectedBook: '=',
			onBookSelected: '='
		},
		controller: ["$scope", function($scope) {
			var booksPerColumn;
			if (!$scope.booksPerColumn) { $scope.booksPerColumn = 16; }	
			if (!$scope.maxColumns) { $scope.maxColumns = 5; }
			if (!$scope.displayMode) { $scope.displayMode = "alphabetic"; }

			$scope.filterBook = function(filter, book) {
				return typeof(filter) === 'undefined' || filter === null || filter == "" || book.toLowerCase().indexOf(filter.toLowerCase()) > -1;
			};

			$scope.showChapters = function(book) {
				$scope.selectedBook = book;
				if ($scope.onBookSelected && typeof $scope.onBookSelected === 'function') {
					$scope.onBookSelected(book);
				}
			};

			$scope.$watchGroup(["books", "sort"], function(oldVal, newVal) {
				if (oldVal != newVal) {
					var books = angular.copy($scope.books);
					if (books.length / $scope.booksPerColumn > $scope.maxColumns) {
						booksPerColumn = Math.ceil(books.length / $scope.maxColumns);
					} else {
						booksPerColumn = $scope.booksPerColumn;
					}

					if ($scope.sort) {
						books.sort(function(a, b) {
							return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1;
						});
					}

					$scope.columns = [];
					var currentColumnIndex = 0;
					var currentColumnCount = 0;
					for(var i = 0; i < books.length; i++) {
				
						if (!$scope.columns[currentColumnIndex]) {
							$scope.columns[currentColumnIndex] = [];
						}

						currentColumnCount++;
						$scope.columns[currentColumnIndex].push(books[i]);

						if (currentColumnCount == $scope.booksPerColumn) {
							currentColumnIndex++;
							currentColumnCount = 0;
						}
					}

					$scope.foundationColumnSize = "text-left columns medium-" + (Math.floor(12 / $scope.columns.length)).toString();
				}
			});	
		}],
		templateUrl: '/reader-book-selector.tpl.html'
	};	
})

;