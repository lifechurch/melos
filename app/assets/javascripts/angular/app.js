angular.module('yv', ['$preloaded'])

.controller("ReaderNotesCtrl", [ '$scope', '$timeout', '$http', '$chapter', '$version', function($scope, $timeout, $http, $chapter, $version) {
    var allNotes;
    var pageSize = 5;
    $scope.currentPage = 0;
    $scope.numberOfPages = 0;

    $scope.collapsed = true;
    $scope.notes = null;

    $scope.toggle = function() {
        // Toggle collapsed
        $scope.collapsed = !$scope.collapsed;

        // If notes is null and widget is open, load notes
        if (!$scope.notes && !$scope.collapsed) {
            var url = '/bible/' + $version.attributes.id + '/' + $chapter.book.toLowerCase() + "." + $chapter.chapter + './notes';
            $scope.loadNotes(url);
        }
    };

    $scope.isEnabled = function(step) {
        if (allNotes && step > 0 && allNotes.length > (($scope.currentPage + step) * pageSize)) {
            return true;
        } else if (allNotes && step < 0 && ($scope.currentPage + step >= 0)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.nextPage = function(step) {
        var newPage = $scope.currentPage + step;
        var start = newPage * pageSize;
        if (allNotes.length >= start) {
            $scope.currentPage = newPage;
            $scope.notes = allNotes.slice(start, start+ pageSize);
        }
    };

    $scope.loadNotes = function(url) {
        $scope.notes = null;

        // If collapsed, then expand
        if ($scope.collapsed) {
            $scope.collapsed = false;
        }

        // Fetch notes from API
        $http.get(url, { cache: true, params: { json: 1 } })
            .success(function(data, status, headers, config) {
                allNotes = data;
                $scope.nextPage(0);
                $scope.numberOfPages = Math.ceil(allNotes.length / pageSize);
            })
            .error(function(data, status, headers, config) {
                allNotes = [];
                $scope.notes = [];
                $scope.numberOfPages = 0;
            });
    }
}])

;