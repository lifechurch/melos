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
	'api.subscriptions',
	'720kb.tooltips',
    'mdColorPicker'
])

.config([ '$stateProvider', function($stateProvider) {
	$stateProvider

	//Basic Reader
	.state('reader', {
		url: 				'/bible/:version/:usfm',
		controller: 			'ReaderCtrl',
		templateProvider: 	function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})
	.state('reader-locale', {
		url: 				'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/bible/:version/:usfm',
		controller: 		'ReaderCtrl',
		templateProvider: 	function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})


	//Bible Plan Sample Reader with Devo Content
	.state('planSample', {
		url: 				'/reading-plans/:plan/day/:day',
		controller: 			'ReaderCtrl',
		templateProvider: 	function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})
	.state('planSample-locale', {
		url: 				'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/reading-plans/:plan/day/:day',
		controller: 			'ReaderCtrl',
		templateProvider: 	function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})


	//Bible Plan for User
	.state('userPlan', {
		url: 				'/users/:username/reading-plans/:plan',
		controller: 			'ReaderCtrl',
		templateProvider: 	function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})
	.state('userPlan-locale', {
		url: 				'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/users/:username/reading-plans/:plan',
		controller: 			'ReaderCtrl',
		templateProvider: 	function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})

	;
}])

.controller("ReaderCtrl", ["$scope", "$stateParams", "$location", "$rootScope", "$state", "$sce", "$timeout", "Highlights", "Bookmarks", "Notes", "Authentication", "Versions", "Bible", "UserSettings", "$window", "Subscription", "$anchorScroll", function($scope, $stateParams, $location, $rootScope, $state, $sce, $timeout, Highlights, Bookmarks, Notes, Authentication, Versions, Bible, UserSettings, $window, Subscription, $anchorScroll) {
	$scope.version = $stateParams.version;
    $scope.parallel_version = $stateParams.version;
	$scope.usfm = $stateParams.usfm;
	$scope.readerFontSize = 19;
	$scope.readerPlaybackSpeed = 1;
	$scope.versions = null;
	$scope.working = false;
	$scope.isLoggedIn = false;
	$scope.verseActionOpen = false;
	$scope.readerSelection = [];
	$scope.highlights = [];
	$scope.bookmarks = [];
	$scope.notes = [];
	$scope.isPlanState = $state.current.name == 'planSample' || $state.current.name == 'userPlan';
	$scope.planContentReady = false;
	$scope.devotionalActive = false;
	$scope.devotionalComplete = false;
	$scope.month = 0;
    $scope.refUsfms = {};
    $scope.planDays = {};
    $scope.orderedRefs = [];
    $scope.isLastPlanRef = false;
    $scope.isParallelMode = false;

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
		$scope.showReaderAudio = false;
		$scope.showReaderFont = false;
		$scope.showReaderBooks = false;
		$scope.showReaderVersions = false;
	}


	/**
	 * Hide all the side panels
	 */
	function hideAllSidePanels() {
		$scope.showReaderHighlight = false;
		$scope.showReaderBookmark = false;
		$scope.showReaderNote = false;
	}


	/**
	 * Load bible chapter from url path
	 */
	function loadChapter(location_path, hideDevotional) {
		// Reset some scope vars
		$scope.working = true;
		$scope.showReaderBooks = false;
		$scope.showReaderChapters = false;
		$scope.readerSelection = [];
		$scope.highlights = [];
		$scope.bookmarks = [];
		$scope.notes = [];
        $anchorScroll("top-of-page");

		Bible.getChapter(location_path).success(function(data, status, headers, config) {
            if (data.hasOwnProperty('to_path')) {
                $scope.version = data.to_path.split("/")[2];
            }
			fillScope(data, hideDevotional);
			$scope.working = false;
		}).error(function(data, status, headers, config) {
			//TO-DO: Handle Error!
			$scope.working = false;
		});

        if ($scope.isParallelMode) {
            var params = location_path.split("/");
            loadParallelChapter(params[3], $scope.parallel_version);
        }
	}


    $scope.loadParallelChapter = function(usfm, version) {
        loadParallelChapter(usfm, version);
    };

    function loadParallelChapter(usfm, version) {
        var location_path = $state.href("reader", {usfm: usfm, version: version});
        $scope.working = true;
        $scope.parallel_version = version;

        Bible.getChapter(location_path).success(function(data, status, headers, config) {
            $scope.working = false;
            $scope.parallel_reader_html = data.reader_html;
            $scope.parallel_reader_version = data.reader_version;
        }).error(function(error) {
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
	function fillScope(newScope, hideDevotional) {
		angular.extend($scope, newScope);

		if ($scope.isPlanState && !hideDevotional) {
			$scope.devotional_first_chapter = $scope.reader_html;
			$scope.reader_html = $scope.devotional_content;
			$scope.planContentReady = true;
			$scope.devotionalActive = true;
		} else {
			$scope.devotionalActive = false;
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
	$scope.togglePanel = function(panel, setParallel) {
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
            if (setParallel) {
                $scope.setParallelVersion = true;
            } else {
                $scope.setParallelVersion = false;
            }
			parseVersionLinks();
		}
	};

    $scope.cancel = function(panel) {
        $scope.togglePanel(panel);
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

    $scope.sortBooks = function(sortType) {
        this.sort = sortType;
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

    $scope.isRefComplete = function(ref) {
        if ($scope.refUsfms.hasOwnProperty(ref) && $scope.refUsfms[ref]) {
            return true;
        } else {
            return false;
        }
    };

    function completeRef(ref) {
        $scope.refUsfms[ref] = true;
    }


    $scope.isDayComplete = function(day) {
        if ($scope.planDays.hasOwnProperty(day) && $scope.planDays[day]) {
            return true;
        } else {
            return false;
        }
    };

    $scope.goToDay = function(day) {
        $location.search('day', day);
        $window.location.href = $location.url();
    };

    function completeDay(day) {
        $scope.planDays[day] = true;
    }

    function completePlan(redirectUrl) {
        $window.location.href = redirectUrl;
    }

    $scope.completeReferenceAndLoadChapter = function(toState, toParams, refUsfm, userPlanUrl, dayTarget, token) {
        var usfm = $scope.refUsfm;
        var version = $scope.version;
        $scope.isLastPlanRef = (getRefIndex(refUsfm) == ($scope.orderedRefs.length - 1));
        if (usfm && version) {
            Subscription.completeReference(userPlanUrl, usfm, version, dayTarget, token).success(function(resp) {
                completeRef(resp.ref);

                if (resp.planComplete) {
                    completePlan(resp.redirectUrl);
                } else if (resp.dayComplete) {
                    completeDay(resp.day);
                }

            }).error(function() {

            });
        }
        $scope.loadChapter(toState, toParams);
        $scope.refUsfm = refUsfm;
    };

    $scope.completeReferenceAndLoadDay = function(userPlanUrl, dayTarget, token) {
        var usfm = $scope.refUsfm;
        var version = $scope.version;
        if (usfm && version) {
            Subscription.completeReference(userPlanUrl, usfm, version, dayTarget, token).success(function(resp) {
                completeRef(resp.ref);

                if (resp.planComplete) {
                    completePlan(resp.redirectUrl);
                } else if (resp.dayComplete) {
                    completeDay(resp.day);
                    $scope.goToDay(parseInt(dayTarget.toString()) + 1);
                }

            }).error(function() {

            });
        }
    };

    $scope.loadChapter = function(toState, toParams) {
        if (toState === null) {
            toState = $state.current.name;
        }
		$scope.usfm = toParams.usfm;
		loadChapter($state.href(toState, toParams), true);
		$scope.devotionalComplete = true;
	};

	$scope.loadDevotional = function() {
		$scope.usfm = null;
		$scope.devotionalActive = true;
		$scope.reader_html = $scope.devotional_content;
	};

    $scope.deselectAll = function() {
        $scope.readerSelection = [];
    };

    $scope.nextPlanRef = function(userPlanUrl, dayTarget, token) {
        var nextRefUsfm;
        var nextRef;
        if ($scope.devotionalActive && $scope.orderedRefs) {
            nextRef = $scope.orderedRefs[0].reference;
        } else {
            var currentRefIndex = getRefIndex($scope.refUsfm);
            $scope.orderedRefs[currentRefIndex].completed = true;
            var nextRefIndex = nextIncompleteRefIndex(currentRefIndex);
            if (nextRefIndex) {
                nextRef = $scope.orderedRefs[nextRefIndex].reference;
            }
        }

        if (nextRef) {
            nextRefUsfm = orderedRefToUsfm(nextRef, true);
            nextRefChapterUsfm = orderedRefToUsfm(nextRef, false);

            $scope.completeReferenceAndLoadChapter(
                'reader',
                { version: nextRef.version, usfm: nextRefChapterUsfm },
                nextRefUsfm,
                userPlanUrl,
                dayTarget,
                token
            );
        } else {
            $scope.completeReferenceAndLoadDay(
                userPlanUrl,
                dayTarget,
                token
            );
        }
    };

    $scope.prevPlanRef = function(userPlanUrl, dayTarget, token) {
        var prevRefUsfm;
        var prevRef;
        if (!$scope.devotionalActive && $scope.orderedRefs) {
            var currentRefIndex = getRefIndex($scope.refUsfm);
            $scope.orderedRefs[currentRefIndex].completed = true;

            if (currentRefIndex == 0) {
                $scope.loadDevotional();
            } else {
                var prevRefIndex = prevRefIndex(currentRefIndex);

                if (prevRefIndex) {
                    prevRef = $scope.orderedRefs[prevRefIndex].reference;
                }

                if (prevRef) {
                    prevRefUsfm = orderedRefToUsfm(prevRef, true);
                    prevRefChapterUsfm = orderedRefToUsfm(prevRef, false);

                    $scope.completeReferenceAndLoadChapter(
                        'reader',
                        { version: prevRef.version, usfm: prevRefChapterUsfm },
                        prevRefUsfm,
                        userPlanUrl,
                        dayTarget,
                        token
                    );
                }
            }
        }
    };

    function prevRefIndex(index) {
        if (index == 0) {
            return false;
        } else {
            return parseInt(index.toString()) - 1;
        }
    }

    function nextIncompleteRefIndex(index) {
        var incompleteRefs = [];
        for (var i = 0; i < $scope.orderedRefs.length; i++) {
            var ref = $scope.orderedRefs[i];
            if (!ref.completed) {
                incompleteRefs.push(i);
            }
        }

        if (incompleteRefs.length == 0) {
            return false;
        } else if (incompleteRefs.indexOf(index + 1) !== -1) {
            return index + 1;
        } else {
            for (var i = 0; i < incompleteRefs.length; i++) {
                if (incompleteRefs[i] > index) {
                    return incompleteRefs[i];
                }
            }
            return incompleteRefs[0];
        }
    }

    function orderedRefToUsfm(ref, includeVerse) {
        //completeReferenceAndLoadChapter(
        // 'reader',
        // {version: 1, usfm: 'pro.15'},
        // 'pro.15.15.kjv',
        // '/users/tjyeldon/reading-plans/1856-struggles?id=1856-struggles',
        // '4',
        // 'PPpHHCfd1VqiDbvlYGUi/IbINaEnNXemeyXKOHH7urE='
        // )

        if (includeVerse) {
            var verses = "";
            if (ref.verses.length > 1) {
                var pv;
                var range;
                for (var i = 0; i < ref.verses.length; i++) {
                    var v = parseInt(ref.verses[i]);

                    if (pv && pv + 1 !== v) {
                        if (range) {
                            verses += "-" + range.toString();
                            range = null;
                        }
                        verses += "," + v.toString();
                    } else if (pv && pv + 1 == v) {
                        range = v;
                    } else if (!pv) {
                        verses = v.toString();
                    }
                    pv = v;
                }

                if (range) {
                    verses += "-" + range.toString();
                    range = null;
                }
            } else if (ref.verses.length == 1) {
                verses = ref.verses[0].toString();
            }
            return [ ref.book.toLowerCase(), ref.chapter.toString(), verses, 'kjv' ].join(".");
        } else {
            return [ ref.book.toLowerCase(), ref.chapter.toString() ].join(".");
        }

    }

    function getRefIndex(usfm) {
        var arr = usfm.split(".");
        for (var i = 0; i < $scope.orderedRefs.length; i++) {
            var ref = $scope.orderedRefs[i];
            if (
                ref.reference.book.toLowerCase() == arr[0].toLowerCase() &&
                ref.reference.chapter == arr[1] &&
                ref.reference.version == getVersionIdFromAbbr(arr[3]) &&
                ref.reference.verses.toString() == getVerseArrayFromRange(arr[2]).toString()
               ) {
               return i;
            }
        }
        return false;
    }

    function getVersionIdFromAbbr(abbr) {
        switch(abbr.toLowerCase()) {
            case "kjv":
                return 1;
        }
    }


    function getVerseArrayFromRange(rng) {
        var arr = rng.split(",");
        var ret = [];
        for (var i = 0; i < arr.length; i++) {
            var iArr = arr[i].split('-');
            if (iArr.length > 1) {
                for (var ii = parseInt(iArr[0]); ii <= iArr[1]; ii++) {
                    ret.push(ii.toString());
                }
            } else {
                ret.push(arr[i].toString());
            }
        }
        return ret;
    }


    $scope.toggleParallelMode = function() {
        if ($scope.isParallelMode) {
            $scope.isParallelMode = false;
        } else {
            $scope.isParallelMode = true;

            if (!$scope.parallel_version) {
                $scope.parallel_version = $scope.version;
                $scope.parallel_reader_version = $scope.reader_version;
            }

            loadParallelChapter($scope.usfm, $scope.parallel_version);
        }
    };


    $scope.inNonDefaultLocale = function() {
      return $stateParams.hasOwnProperty('locale');
    };


	/**
	 * Don't reload controller if navigating back to this same state, instead
	 * just make the new chapter call and switch the URL in the browser
	 */
	$rootScope.$on("YV:reloadState", function(event, stateInfo) {
        var toState 	= stateInfo[0];
        var toParams 	= stateInfo[1];

        // Fetch new data
        loadChapter($state.href(toState, toParams));

        // Switch to the new URL without loading the controller again
        //$state.go(toState, toParams, { notify: false});

        // Get new scope values from params
        $scope.version 	= toParams.version;
        $scope.usfm     = toParams.usfm;
	});

	Authentication.isLoggedIn('/isLoggedIn').success(function(data) {
		if (data === true) {
			$scope.isLoggedIn = true;
		}
	}).error(function(data) {
		//TO-DO: Handle Error
	});

    if ($scope.isPlanState) {
        $scope.day = $location.search().day;
        Subscription.getRefs($location.path(), $scope.day, $stateParams.plan ).success(function (resp) {
            $scope.orderedRefs = resp;
        }).error(function (err) {

        });
    }
}])

;