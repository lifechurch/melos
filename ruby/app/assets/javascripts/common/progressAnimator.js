angular.module('common.progressAnimator', [])

    .directive('progressAnimator', function() {
        return {
            restrict: 'A',
            scope: {
                percentComplete: '='
            },
            controller: ["$element", "$scope", "$timeout", function($element, $scope, $timeout) {
                $element.css('transition', 'width 1.5s ease');
                $element.css('width', '0px');
                $timeout(function() {
                    $element.css('width', $scope.percentComplete + '%');
                });
            }]
        };
    })

;