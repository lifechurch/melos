/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
/*
 * This is a modified version of the ng-inifinite-scroll module intended to function
 * without a jQuery dependency. However, the following functions may need to be tweaked
 * to be fully compatible with all browsers:
 *  * windowHeight()
 *  * scrollTop()
 *  * offsetTop()
 *  * offsetHeight()
 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
    '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
        function windowHeight() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        }

        function scrollTop() {
            return document.body.scrollTop || document.documentElement.scrollTop;
        }

        function offsetTop(elem) {
            return elem[0].offsetTop;
        }

        function offsetHeight(elem) {
            return elem[0].offsetHeight;
        }

        return {
            link: function(scope, elem, attrs) {
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element($window);
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function(value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function(value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function() {
                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = windowHeight() + scrollTop();
                    elementBottom = offsetTop(elem) + offsetHeight(elem);
                    remaining = elementBottom - windowBottom;
                    shouldScroll = remaining <= windowHeight() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScroll);
                        } else {
                            return scope.$apply(attrs.infiniteScroll);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);
                scope.$on('$destroy', function() {
                    return $window.off('scroll', handler);
                });
                return $timeout((function() {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
    }
]);