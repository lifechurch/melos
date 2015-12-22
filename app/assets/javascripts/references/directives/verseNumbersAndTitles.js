angular.module('reader.verseNumbersAndTitles', [])

    .directive('label', [ 'FootnoteCounter', function(FootnoteCounter) {
        return {
            restrict: 'C',
            require: '^^reader',
            controller: ['$scope', '$element',  function($scope, $element) {
                $scope.$watch('showNumbersAndTitles', function(newVal, oldVal) {
                    if(newVal) {
                        $element.css("display", "inherit");
                    } else {
                        $element.css("display", "none");
                    }
                });
            }]
        }
    }])

;