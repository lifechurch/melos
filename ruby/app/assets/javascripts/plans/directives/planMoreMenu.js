angular.module('yv.plans.moreMenu', [])

    .directive('planMoreMenu', function() {
        return {
            restrict: 'A',
            controller: ["$scope", "$element", function($scope, $element) {}]
        };
    })
;