angular.module("reader.versionList", [])

.factory("VersionFilterService", ["$timeout", function($timeout) {
    var list = [];
    var cancelFilter = null;
    var listener = null;

    function filterList(filter) {
        filter = filter.toUpperCase();
        if (typeof filter !== 'undefined' && list && list.length) {
            var filteredVersions = [];
            list.forEach(function (language, index, array) {
                filteredVersions = filteredVersions.concat(language.versions.filter(function (version, index, array) {
                    return (version.abbr.toUpperCase().indexOf(filter) > -1 || version.title.toUpperCase().indexOf(filter) > -1 || version.language_name.toUpperCase().indexOf(filter) > -1 || version.language_local_name.toUpperCase().indexOf(filter) > -1);
                }));
            });
            var filteredIds = [];
            filteredVersions = filteredVersions.filter(function (version, index, array) {
                if (filteredIds.indexOf(version.id) == -1) {
                    filteredIds.push(version.id);
                    return true;
                } else {
                    return false;
                }
            });
            return filteredVersions;
        } else {
            return [];
        }
    }

    return {
        setMasterList: function(l) {
            if (list.length == 0) {
                list = l;
            }
        },

        filterList: function(filter) {
            if (cancelFilter !== null) {
                $timeout.cancel(cancelFilter);
            }
            cancelFilter = $timeout(function() {
                filteredList = filterList(filter);
                cancelFilter = null;
                if (listener) {
                    setTimeout(function() { listener(filteredList) });
                }
            }, 200);
        },

        registerListener: function(fn) {
            listener = fn;
        }
    }
}])

.directive("readerVersionList", function() {
	return {
		restrict: 'A',
		scope: {
			versions: '=',
			usfm: '=',
			togglePanel: '=',
            loadParallelChapter: '=',
            setParallelVersion: '=',
            loadChapter: '=',
            executeFilter: '='
		},
		controller: ["$scope", "$state", "RecentVersions", "VersionFilterService", "$element", "$compile", function($scope, $state, RecentVersions, VersionFilterService, $element, $compile) {

            $scope.recentVersions = RecentVersions.all();
            var filteredVersions = [];

            VersionFilterService.registerListener(function(versions) {
                filteredVersions = versions;
                var html = "<div>";
                var lastLang = null;
                versions.forEach(function(version) {

                    if (lastLang !== version.language_local_name) {
                        lastLang = version.language_local_name;
                        html += "</ul><h1>" + version.language_name;
                        if (version.language_name !== version.language_local_name) {
                            html += " <span>" + version.language_local_name + "</span>";
                        }
                        html += "</h1><ul class='side-nav' role='navigation'>";
                    }

                    html += "<li class='menuitem'>";
                    html += "<a ng-click='loadVersion(" + version.id + ",true)'><b>" + version.abbr.toUpperCase() + "</b> " + version.title + "</a>";
                    html += "</li>"
                });
                var listEl = $element.find("versionlist")
                listEl.html(html);
                $compile(listEl.contents())($scope);
            });

            $scope.recentVersionCount = function() {
                return RecentVersions.count();
            };

            var cancelWatcher = $scope.$watch("versions", function(newVal, oldVal) {
                if (typeof newVal !== 'undefined' && newVal && newVal.length > 0) {
                    cancelWatcher();
                    VersionFilterService.setMasterList(newVal);
                    VersionFilterService.filterList("");
                }
            });

            $scope.executeFilter = function(filter) {
                VersionFilterService.filterList(filter);
            };

			$scope.loadVersion = function(versionId, saveToRecent) {
                if (saveToRecent) {
                    var version = {};
                    for (var x = 0; x < filteredVersions.length; x++) {
                        if (filteredVersions[x].id == versionId) {
                            version = filteredVersions[x];
                            break;
                        }
                    }
                    RecentVersions.add(version);
                    $scope.recentVersions = RecentVersions.all();
                }

                $scope.togglePanel('showReaderVersions');

                if ($scope.setParallelVersion) {
                    $scope.loadParallelChapter($scope.usfm, versionId);
                } else {
                    $scope.loadChapter($state.current.name, { usfm: $scope.usfm, version: versionId })
                }
			};

		}],
		templateUrl: '/reader-version-selector.tpl.html'
	};
})

;