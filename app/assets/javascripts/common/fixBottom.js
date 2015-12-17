angular.module('common.fixBottom', [])

    .directive('fixBottom', function() {
        return {
            restrict: 'A',
            controller: ['$element', '$window', '$rootScope', function($element, $window, $rootScope) {
                $element.css('position', 'fixed');
                $element.css('z-index', '50');
                $rootScope.$on('Scroll', function() {
                    var bottomOfContent = $window.document.getElementById('current-ui-view').clientHeight;
                    var bottomOfScroll = window.pageYOffset + window.innerHeight;
                    var newBottom = (bottomOfScroll > bottomOfContent) ? bottomOfScroll - bottomOfContent : 0;
                    $element.css('bottom', newBottom);
                });
            }]
        };
    })

;