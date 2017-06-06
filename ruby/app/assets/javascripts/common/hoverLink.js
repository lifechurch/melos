angular.module('common.hoverLink', [])

    .directive('hoverLink', function() {
        return {
            restrict: 'A',
            scope: {
                hoverText: '@',
                linkText: '@'
            },
            link: function(scope, element) {
                element.on("mouseenter", function() {
                   element.text(scope.hoverText);
                });

                element.on("mouseleave",  function() {
                    element.text(scope.linkText);
                });
            }
        };
    })

;