angular.module('reader.sharePanel', [])

    .directive("readerSharePanel", function() {
        function joinUsfms(usfms) {
            var usfms = angular.copy(usfms).sort();
            if (typeof usfms === 'object' && usfms.length) {
                var finalUsfm;
                var book;
                var chapter;
                var finalVerse;
                var prevVerse;
                var inRange = false;
                for (var u = 0; u < usfms.length; u++) {
                    var usfm = usfms[u].split(".");
                    if (!book) {
                        book = usfm[0];
                    }

                    if (!chapter) {
                        chapter = usfm[1];
                    }

                    if (book == usfm[0] && chapter == usfm[1]) {
                        var verse = parseInt(usfm[2]);
                        if (typeof finalVerse === 'undefined' || finalVerse === null) {
                            finalVerse = verse.toString();
                        } else {
                            if (prevVerse == (verse - 1)) {
                                inRange = true;
                            } else {
                                if (inRange) {
                                    inRange = false;
                                    finalVerse += "-" + prevVerse.toString();
                                }
                                finalVerse += "," + verse.toString();
                            }
                        }
                        prevVerse = verse;
                    }
                }

                if (inRange) {
                    finalVerse += "-" + verse.toString();
                }

                return [book, chapter, finalVerse].join('.');
            } else {
                return null;
            }
        }

        return {
            restrict: 'A',
            scope: {
                selection: '=',
                selectionText: '=',
                version: '=',
                token: '=',
                toggleSidePanel: '=',
                isLoggedIn: '=',
                orderedRefToUsfm: '='
            },
            templateUrl: '/reader-share-panel.tpl.html',
            controller: ['$scope', '$element', '$timeout', '$rootScope', '$location', '$window', '$state', '$stateParams', function($scope, $element, $timeout, $rootScope, $location, $window, $state, $stateParams) {
                function getUrlFromSelection(selection) {
                    var usfm = joinUsfms($scope.selection);
                    var state;
                    if ($stateParams.hasOwnProperty("locale")) {
                        state = "reader-locale";
                    } else {
                        state = "reader";
                    }
                    var params = { version: $scope.version, usfm: usfm };
                    var path = $state.href(state, params);
                    var baseUrl = $location.absUrl().replace($location.url(), "");
                    return [baseUrl, path].join("");
                }

                $scope.shareUrl = $location.absUrl();

                $scope.$watch("selection.length", function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        if (!$window.addthis_share) {
                            $window.addthis_share = {};
                        }
                        $window.addthis_share.url = getUrlFromSelection($scope.selection);
                    }
                });

                $scope.$watch("selectionText.length", function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        if (!$window.addthis_share) {
                            $window.addthis_share = {};
                        }
                        $window.addthis_share.title = $scope.selectionText.sort().join("; ");
                    }
                });

                $scope.selectionToString = function() {
                    if (typeof $scope.selection === 'object' && $scope.selection.length) {
                        return $scope.selection.join(',');
                    } else {
                        return null;
                    }
                };

                if (!$window.shareInitialized) {
                    $window.addthis.init();
                    $window.shareInitialized = true;
                }
            }]
        }
    })

;