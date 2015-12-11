angular.module('reader.sharePanel', [])

    .directive("readerSharePanel", function() {
        return {
            restrict: 'A',
            scope: {
                selection: '=',
                version: '=',
                token: '=',
                toggleSidePanel: '=',
                isLoggedIn: '='
            },
            templateUrl: '/reader-share-panel.tpl.html',
            controller: ['$scope', '$element', '$timeout', '$rootScope', '$location', '$window', function($scope, $element, $timeout, $rootScope, $location, $window) {
                $scope.shareUrl = $location.absUrl();

                $scope.$watch("selection", function(newVal, oldVal) {
                    console.log("newVal", newVal);
                    console.log("oldVal", oldVal);
                    $window.addthis_share = {
                        title: "Hello Share",
                        url: $location.absUrl()
                    };
                });

                if (!$window.shareInitialized) {
                    $window.addthis.init();
                }

                /*
                $scope.updateForm = function(params) {
                    var lastIndex, link, selected_content, verses_str;
                    if (params.link) {
                        link = params.link.trim();
                        this.short_link.html(link);
                        verses_str = '';
                        selected_content = this.getSelectedVersesContent();
                        if (selected_content.length !== 0) {
                            verses_str = $.makeArray(selected_content.map(function(index, el) {
                                return $(el).html();
                            }));
                            verses_str = verses_str.join(" ").trim();
                        }
                        if (verses_str.length > 102) {
                            verses_str = verses_str.substring(0, 100);
                            lastIndex = verses_str.lastIndexOf(" ");
                            verses_str = verses_str.substring(0, lastIndex).trim() + "...";
                        }
                        return window.addthis_share = {
                            title: verses_str,
                            url: link
                        };
                    }
                };
                */


            }]
        }
    })

;