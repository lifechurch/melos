angular.module('yv.reader', [
	'reader.chapterList',
	'reader.versionList',
	'reader.reader',
	'reader.verseAction',
	'reader.highlightPanel',
    'reader.sharePanel',
	'reader.bookmarkPanel',
	'reader.notePanel',
	'reader.textSettingsPanel',
	'reader.audioPanel',
	'reader.verse',
	'reader.footnote',
    'reader.verseNumbersAndTitles',
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

.controller("ReaderCtrl", ["$scope", "$stateParams", "$location", "$rootScope", "$state", "$sce", "$timeout", "Highlights", "Bookmarks", "Notes", "Authentication", "Versions", "Bible", "UserSettings", "$window", "Subscription", "$anchorScroll", "$q", function($scope, $stateParams, $location, $rootScope, $state, $sce, $timeout, Highlights, Bookmarks, Notes, Authentication, Versions, Bible, UserSettings, $window, Subscription, $anchorScroll, $q) {
	$scope.reader_version_id = $stateParams.version;
    $scope.parallel_version = $stateParams.version;
	$scope.usfm = $stateParams.usfm;
	$scope.readerFontSize = 19;
	$scope.readerPlaybackSpeed = 1;
	$scope.versions = null;
	$scope.working = false;
	$scope.isLoggedIn = false;
	$scope.verseActionOpen = false;
    $scope.panelIsOpen = false;
    $scope.showNumbersAndTitles = true;
    $scope.showFootnotes = true;
	$scope.readerSelection = [];
    $scope.readerSelectionText = [];
	$scope.highlights = [];
	$scope.bookmarks = [];
	$scope.notes = [];
	$scope.isPlanState = ['planSample', 'planSample-locale', 'userPlan', 'userPlan-locale'].indexOf($state.current.name) > -1;
	$scope.planContentReady = false;
	$scope.devotionalActive = false;
	$scope.devotionalComplete = false;
	$scope.month = 0;
    $scope.refUsfms = {};
    $scope.planDays = {};
    $scope.orderedRefs = [];
    $scope.isLastPlanRef = false;
    $scope.isParallelMode = false;
    $scope.reader_book_list = [];
    $scope.isMobile = Foundation.utils.is_small_only() || Foundation.utils.is_medium_only();
    $scope.showContent = !$scope.isMobile;

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
        $scope.showReaderShare = false;
	}


	/**
	 * Load bible chapter from url path
	 */
	function loadChapter(location_path, hideDevotional) {
//        console.log('LoadChapter.1');
		// Reset some scope vars
		$scope.working = true;
		$scope.showReaderBooks = false;
		$scope.showReaderChapters = false;
		$scope.readerSelection = [];
        $scope.readerSelectionText = [];
		$scope.highlights = [];
		$scope.bookmarks = [];
		$scope.notes = [];
        $scope.reader_book_list = [];
        $scope.filter = "";
        $scope.selectedBook = null;
        $anchorScroll("top-of-page");

		Bible.getChapter(location_path).success(function(data, status, headers, config) {
            if (data.hasOwnProperty('to_path')) {
                $scope.reader_version_id = data.to_path.split("/")[2];
            }
			fillScope(data, hideDevotional);
            loadBooks($scope.reader_version_id);
			$scope.working = false;

            var toState = $state.current;
            var toParams = {};
            if ($stateParams.hasOwnProperty('locale')) {
                toParams = { usfm: removeVersionFromUsfm($scope.usfm).toLowerCase(), version: $scope.reader_version_id, locale: $stateParams.locale};
            } else {
                toParams = { usfm: removeVersionFromUsfm($scope.usfm).toLowerCase(), version: $scope.reader_version_id};
            }
            var promise = $state.go(toState, toParams, { notify: false});
            promise.then(function() {
                // add g.a. virtual pageview
                // console.log($location.path());
                dataLayer.push({
                    'event': 'VirtualPageview',
                    'virtualPageURL': $location.path(),
                    'virtualPageTitle' : 'VirtualPageview: ' + $location.path()
                });
            });

		}).error(function(data, status, headers, config) {
			//TO-DO: Handle Error!
			$scope.working = false;
		});

        if ($scope.isParallelMode) {
            var params = location_path.split("/");
            if ($stateParams.hasOwnProperty('locale')) {
                var parallel_usfm = params[4];
            } else {
                var parallel_usfm = params[3];
            }
            loadParallelChapter(parallel_usfm, $scope.parallel_version);
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
        return $q(function(resolve, reject) {
            Versions.get($scope.reader_version).success(function(data, status, headers, config) {
                fillScope({versions: data.by_language});
                $scope.working = false;
                resolve();
            }).error(function(data, status, headers, config) {
                //TO-DO: Handle Error!
                $scope.working = false;
                reject();
            });
        });
	}

    function loadBooks(versionId) {
        Versions.getSingle(versionId).success(function(v) {
          $scope.reader_book_list = v[0].books;
          for (var b = 0; b < $scope.reader_book_list.length; b++) {
              var book = $scope.reader_book_list[b];
              if (book.human == $scope.reader_book) {
                  $scope.selectedBook = book;
                  break;
              }
          }
        }).error(function(error) {

        });
    }


	/**
	 * Take all the key/value pairs from an
	 *  object and make them available as
	 *  part of $scope
	 */
	function fillScope(newScope, hideDevotional) {
		angular.extend($scope, newScope);

        if ($scope.devotional_content && $scope.devotional_content.length > 1) {
            $scope.hasDevotionalContent = true;
        } else {
            $scope.hasDevotionalContent = false;
        }

        if ($scope.isPlanState && !hideDevotional) {
            $scope.devotional_first_chapter = $scope.reader_html;
            if ($scope.hasDevotionalContent) {
                $scope.reader_html = $scope.devotional_content;
                $scope.planContentReady = true;
                $scope.devotionalActive = true;
            } else {
                $scope.planContentReady = true;
                $scope.devotionalActive = false;
            }
        } else {
            $scope.devotionalActive = false;
        }

        if (!$scope.usfm) {
            var nextOrPrevRef = newScope.next_chapter_hash || newScope.previous_chapter_hash;

            if (nextOrPrevRef && nextOrPrevRef.usfm && nextOrPrevRef.usfm.length) {
                var usfm = nextOrPrevRef.usfm[0];
                var usfmParts = usfm.split('.');
                usfmParts[1] = newScope.reader_chapter.toString();
                $scope.usfm = usfmParts.join('.');
            }
        }

        //TO-DO: Make Audio Directive
        if ($scope.reader_audio && $scope.reader_audio.url) {
            var player = document.getElementById("reader_audio_player");
            if (player) {
                player.src = $sce.trustAsResourceUrl($scope.reader_audio.url);
            }
        }

        if (!$scope.reader_version_id) {
            if ($scope.reader_version) {
                if (!$scope.versions || !$scope.versions.length) {
                    loadVersions().then(finishFill, function(error) {});
                } else {
                    finishFill();
                }
            }
        } else {
            finishFill();
        }

        function finishFill() {
            getVersionIdFromAbbr($scope.reader_version).then(function(reader_version_id) {
                $scope.reader_version_id = reader_version_id;

                if ($scope.reader_version_id && typeof $scope.reader_version_id !== 'undefined') {
                    Highlights.get($scope.reader_version_id, $scope.usfm).success(function (data) {
                        $scope.highlights = data;
                    }).error(function (err) {
                        //TO-DO: Handle Error
                    });

                    Bookmarks.get($scope.reader_version_id, $scope.usfm).success(function (data) {
                        $scope.bookmarks = data;
                    }).error(function (err) {
                        //TO-DO: Handle Error
                    });

                    // Notes.get($scope.reader_version_id, $scope.usfm).success(function(data) {
                    // 	$scope.notes = data;
                    // }).error(function(err) {
                    // 	//TO-DO: Handle Error
                    // });
                }
            });
        }
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

//	function parseVersionLinks() {
//		if (!$scope.reader_version_list || $scope.reader_version_list.length == 0) {
//			var reader_version_children = angular.element(document.getElementById("reader_version_list")).children();
//			$scope.reader_version_list = [];
//			for (var i = 0; i < reader_version_children.length; i++) {
//				$scope.reader_version_list.push({
//					abbrev: 	reader_version_children[i].dataset.abbrev,
//					meta: 		reader_version_children[i].dataset.meta,
//					title: 		reader_version_children[i].dataset.title,
//					version: 	reader_version_children[i].dataset.version
//				});
//			}
//		}
//	}


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
            if ($scope.reader_book_list.length == 0) {
                loadBooks($scope.reader_version_id);
            }
		} else if (panel == "showReaderChapters") {
            if ($scope.reader_book_list.length == 0) {
                loadBooks($scope.reader_version_id);
            }

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

            if (!$scope.versions || !$scope.versions.length) {
                loadVersions();
            }
		}
	};

    $scope.cancel = function(panel) {
        $scope.togglePanel(panel);
    };

    $scope.toggleContent = function(show) {
        $scope.showContent = show;
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

        // If we just opened a side panel, close verse action bar
        if ($scope[panel]) {
            $scope.verseActionOpen = false;
            $scope.panelIsOpen = true;
        } else {
            $scope.panelIsOpen = false;
        }
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
        if (book) {
            $scope.selectedBook = book;
        }
        $scope.togglePanel("showReaderChapters");
	};


	// Load data from page variable or ajax
	if (TEMPLATE_FROM_RAILS.hasOwnProperty($location.path())) {
		fillScope(TEMPLATE_FROM_RAILS[$location.path()]);
	} else {
		loadChapter($location.path());
	}

    $scope.isRefActive = function(ref) {
        ref = removeVersionFromUsfm(ref);
        return ($scope.refUsfm == ref || (!$scope.refUsfm && getRefIndex(ref) === 0));
    };

    $scope.isRefComplete = function(ref) {
        ref = removeVersionFromUsfm(ref);
        if ($scope.refUsfms.hasOwnProperty(ref) && $scope.refUsfms[ref]) {
            return true;
        } else {
            return false;
        }
    };

    function completeRef(ref) {
        $scope.refUsfms[removeVersionFromUsfm(ref)] = true;
    }

    function removeVersionFromUsfm(usfm) {
        var parts = usfm.split('.');
        var lastPart = parts.pop();
        var nextLastPart = parts.pop();

        if (nextLastPart != "") {
            parts.push(nextLastPart);
        }

        if (!isNaN(lastPart) || lastPart.indexOf('-') != -1) {
            parts.push(lastPart);
        }
        return parts.join('.');
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
//        console.log('completeReferenceAndLoadChapter');
        $scope.working = true;
        var version = $scope.reader_version_id;
        var usfm = $scope.refUsfm;
        var needToComplete = true;

        if(version) {
            toParams.version = version;
            //toParams.usfm = removeVersionFromUsfm(refUsfm);
        }


        if (!usfm) {
            orderedRefToUsfm($scope.orderedRefs[0].reference, true).then(function (_usfm) {
                usfm = _usfm;
                needToComplete = !$scope.hasDevotionalContent;
                finish();
            }, function (error) {

            });
        } else {
            finish();
        }

        function finish() {
            $scope.isLastPlanRef = (getRefIndex(refUsfm) == ($scope.orderedRefs.length - 1));
            if (usfm && version && needToComplete) {
                Subscription.completeReference(userPlanUrl, usfm, version, dayTarget, token).success(function (resp) {
                    completeRef(resp.ref);

                    if (resp.planComplete) {
                        completePlan(resp.redirectUrl);
                    } else if (resp.dayComplete) {
                        completeDay(resp.day);
                    }

                }).error(function () {

                });
            }
            $scope.loadChapter(toState, toParams);
            $scope.refUsfm = removeVersionFromUsfm(refUsfm);
        }
    };

    $scope.completeReferenceAndLoadDay = function(userPlanUrl, dayTarget, token) {
        var usfm = $scope.refUsfm;
        var version = $scope.reader_version_id;
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
//        console.log('LoadChapter.2');
        if (toState === null) {
            toState = $state.current.name;
        } else if (['userPlan', 'userPlan-locale'].indexOf(toState) > -1) {
            toState = 'reader';
        }
		$scope.usfm = toParams.usfm;
		loadChapter($state.href(toState, toParams), true);
		$scope.devotionalComplete = true;
	};

	$scope.loadDevotional = function() {
        if ($scope.hasDevotionalContent) {
            $scope.usfm = null;
            $scope.devotionalActive = true;
            $scope.reader_html = $scope.devotional_content;
        }
	};

    $scope.deselectAll = function() {
        $scope.readerSelection = [];
        $scope.readerSelectionText = [];
        $rootScope.$broadcast("ClearVerseSelection");
    };

    $scope.nextPlanRef = function(userPlanUrl, dayTarget, token, isFinish) {
        if (!$scope.working) {
            var nextRefUsfm;
            var nextRef;
            $scope.working = true;

            if (!isFinish) {
                if ($scope.devotionalActive && $scope.orderedRefs) {
                    nextRef = $scope.orderedRefs[0].reference;
                } else {
                    var currentRefIndex;

                    if (!$scope.refUsfm) {
                        currentRefIndex = 0;
                    } else {
                        currentRefIndex = getRefIndex($scope.refUsfm);
                    }

                    $scope.orderedRefs[currentRefIndex].completed = true;
                    var _nextRefIndex = nextRefIndex(currentRefIndex);
                    if (_nextRefIndex) {
                        nextRef = $scope.orderedRefs[_nextRefIndex].reference;
                    }
                }

                if (nextRef) {
                    orderedRefToUsfm(nextRef, true).then(function (nextRefUsfm) {
                        orderedRefToUsfm(nextRef, false).then(function (nextRefChapterUsfm) {
                            $scope.completeReferenceAndLoadChapter(
                                'reader',
                                { version: nextRef.version, usfm: nextRefChapterUsfm },
                                nextRefUsfm,
                                userPlanUrl,
                                dayTarget,
                                token
                            );

                        }, function (error) {
                            $scope.working = false;
                        });
                    }, function (error) {
                        $scope.working = false;
                    });
                } else {
                    $scope.working = false;
                }
            } else {
                $scope.completeReferenceAndLoadDay(
                    userPlanUrl,
                    dayTarget,
                    token
                );
            }
        }
    };

    $scope.prevPlanRef = function(userPlanUrl, dayTarget, token) {
        if (!$scope.working) {
            var prevRefUsfm;
            var prevRef;
            if (!$scope.devotionalActive && $scope.orderedRefs) {
                var currentRefIndex = getRefIndex($scope.refUsfm);
                $scope.orderedRefs[currentRefIndex].completed = true;

                if (currentRefIndex == 0) {
                    if ($scope.hasDevotionalContent) {
                        $scope.loadDevotional();
                        $scope.isLastPlanRef = false;
                    }
                } else {
                    var _prevRefIndex = prevRefIndex(currentRefIndex);

                    if (_prevRefIndex !== false) {
                        prevRef = $scope.orderedRefs[_prevRefIndex].reference;
                    }

                    if (prevRef) {
                        orderedRefToUsfm(prevRef, true).then(function (prevRefUsfm) {
                            orderedRefToUsfm(prevRef, false).then(function (prevRefChapterUsfm) {
                                $scope.completeReferenceAndLoadChapter(
                                    'reader',
                                    { version: prevRef.version, usfm: prevRefChapterUsfm },
                                    prevRefUsfm,
                                    userPlanUrl,
                                    dayTarget,
                                    token
                                );
                            }, function (error) {

                            });
                        }, function (error) {

                        });
                    }
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

    function nextRefIndex(index) {
        var incompleteRefs = $scope.orderedRefs;
        var newIndex = index + 1;

        if (newIndex < incompleteRefs.length) {
            return newIndex;
        } else {
            return false;
        }
    }

    function orderedRefToUsfm(ref, includeVerse) {
        return $q(function(resolve, reject) {
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

                getVersionAbbrFromId(ref.version).then(function(versionAbbr) {
                    resolve([ ref.book.toLowerCase(), ref.chapter.toString(), verses, versionAbbr ].join("."));
                }, function(err) {
                    reject(err);
                });

            } else {
                resolve([ ref.book.toLowerCase(), ref.chapter.toString() ].join("."));
            }
        });
    }

    function getRefIndex(usfm) {
        var arr = usfm.split(".");
        for (var i = 0; i < $scope.orderedRefs.length; i++) {
            var ref = $scope.orderedRefs[i];
            if (
                 (arr.length > 2
                   && ref.reference.book.toLowerCase() == arr[0].toLowerCase()
                   && ref.reference.chapter == arr[1]
                   && ref.reference.verses.toString() == getVerseArrayFromRange(arr[2]).toString()
                 ) ||
                 (arr.length > 1
                    && ref.reference.book.toLowerCase() == arr[0].toLowerCase()
                    && ref.reference.chapter == arr[1]
                 )
               )
            {
               return i;
            }
        }
        return false;
    }

    function getVersionIdFromAbbr(abbr) {
        return $q(function(resolve, reject) {
            if (!$scope.versions || !$scope.versions.length) {
                loadVersions().then(function(data) {
                    getAbbr();
                }, function(error) {

                });
            } else {
                getAbbr();
            }

            function getAbbr() {
                for (var x = 0; x < $scope.versions.length; x++) {
                    var lang = $scope.versions[x];
                    for (var y = 0; y < lang.versions.length; y++) {
                        var v = lang.versions[y];
                        if (v.abbr.toLowerCase() == abbr.toLowerCase()) {
                            resolve(v.id);
                            break;
                        }
                    }
                }
                resolve(null);
            }
        });
    }

    function getVersionAbbrFromId(id) {
        function getId() {
            for (var x = 0; x < $scope.versions.length; x++) {
                var lang = $scope.versions[x];
                for (var y = 0; y < lang.versions.length; y++) {
                    var v = lang.versions[y];
                    if (v.id.toString() == id.toString()) {
                        return v.abbr.toString().toLowerCase();
                    }
                }
            }
            return null;
        }
        return $q(function(resolve, reject) {
            if (!$scope.versions || !$scope.versions.length) {
                loadVersions().then(function(data) {
                    resolve(getId());
                }, function(error) {
                    reject(error);
                });
            } else {
                resolve(getId());
            }
        });
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
                $scope.parallel_version = $scope.reader_version_id;
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
        var toState 	= stateInfo[0].name == 'userPlan' ? 'reader' : stateInfo[0];
        var toParams 	= stateInfo[1];

//        if (toState.name == 'userPlan') {
//            toState = 'reader';
//            toParams = ;
//        }
        // Fetch new data
        loadChapter($state.href(toState, toParams));

        // Switch to the new URL without loading the controller again
        $state.go(toState, toParams, { notify: false});

        // Get new scope values from params
        $scope.reader_version_id = toParams.version;
        $scope.usfm = toParams.usfm;
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
            orderedRefToUsfm($scope.orderedRefs[0].reference).then(function(usfm) {
               $scope.usfm = usfm;
            }, function(err) {

            });
        }).error(function (err) {

        });
    } else {
        $timeout(function() {
            loadVersions().then(function(data) {
                if ($scope.reader_book_list.length == 0) {
                    loadBooks($scope.reader_version_id);
                }
            });
            if ($scope.reader_book_list.length == 0) {
                loadBooks($scope.reader_version_id);
            }
        });
    }
}])

;