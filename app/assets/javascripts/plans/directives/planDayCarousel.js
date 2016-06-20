angular.module('yv.moments.planDayCarousel', [])

    .directive('planDayCarousel', function() {
        return {
            restrict: 'A',
            controller: ["$element", "$scope", "$timeout", function($element, $scope, $timeout) {
                var plans = [];
                $element.addClass('box');
                $element.slick({
                    centerMode: false,
                    centerPadding: "0px",
                    slidesToShow: 7,
                    slidesToScroll: 7,
                    infinite: false,
                    variableWidth: true,
                    responsive: [
                        {
                            breakpoint: 768,
                            settings: {
                                arrows: false,
                                centerPadding: "10px",
                                slidesToShow: 1
                            }
                        }
                    ]
                });
            }]
        };
    })

;