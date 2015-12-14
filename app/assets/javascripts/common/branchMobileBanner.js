angular.module('common.branchMobileBanner', [])

    .directive('branchMobileBanner', function() {
        return {
            restrict: 'A',
            scope: {
                bannerTitle: '@',
                bannerAction: '@',
                bannerOpen: '@'
            },
            controller: [ '$scope', function($scope) {
                angular.element(document).ready(function() {
                    if (Foundation.utils.is_small_only()) {
                        b = new Branch();
                        options = {title: $scope.bannerTitle, action: $scope.bannerAction, open: $scope.bannerOpen};
                        b.banner(options);
                    }
                });
            }]
        };
    })
;