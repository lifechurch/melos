angular.module('yv.moments.moreMenu', [])

    .directive('moreMenu', function() {
        return {
            replace: false,
            restrict: 'A',
            scope: {
              moment: '='
            },
            templateUrl: '/moment-more-menu.tpl.html',
            controller: [ '$scope', '$mdDialog', '$window', 'Subscription', function($scope, $mdDialog, $window, Subscription) {
                $scope.getReadLink = function(basePath) {
                    var version_id = 1;
                    var usfm;
                    var o = $scope.moment.object;

                    if (o.version) {
                        version_id = o.version;
                    }

                    if (o.references && o.references.length && o.references[0].hasOwnProperty('version_id')) {
                        version_id = o.references[0].version_id;
                        usfm = o.references[0].usfm;
                    } else if (o.references && o.references.length) {
                        usfm = o.references[0];
                    }

                    return basePath + "/" + version_id + "/" + usfm;
                };

                $scope.startPlan = function(privacy, yes, no, cancel, start, basePath, token, ev) {
                    var o = $scope.moment.object;
                    if (o.actions.start_plan) {
                        var startDialog = $mdDialog.confirm()
                            .title(start)
                            .content(privacy)
                            .clickOutsideToClose(true)
                            .ariaLabel(start)
                            .targetEvent(ev)
                            .ok(yes)
                            .cancel(no);

                        $mdDialog.show(startDialog).then(function() {
                            Subscription.create(basePath, o.plan_id, 'false', token).success(function(resp) {
                                $window.location.href = basePath + "/" + o.plan_id;
                            }).error(function(err) {

                            });

                        }, function() {
                            Subscription.create(basePath, o.plan_id, 'true', token).success(function(resp) {
                                $window.location.href = basePath + "/" + o.plan_id;
                            }).error(function(err) {

                            });
                        });
                    }
                };
            }]
        };
    })

;