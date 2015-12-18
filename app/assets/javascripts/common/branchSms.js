angular.module('common.branchSms', [])

    .directive('branchSms', function() {
        return {
            restrict: 'A',
            scope: {

            },
            controller: [ '$scope', function($scope) {
                angular.element(document).ready(function() {
                    if (Foundation.utils.is_medium_up()) {
                        loadsms();
                    }
                });
            }]
        };
    })
;