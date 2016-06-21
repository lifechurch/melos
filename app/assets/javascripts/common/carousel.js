angular.module('common.carousel', [])

    .directive('carousel', function() {
        return {
            restrict: 'AC',
            scope: {
                centerMode: '=',
                centerPadding: '=',
                slidesToShow: '=',
                slidesToScroll: '=',
                infinite: '=',
                variableWidth: '=',
                autoplay: '=',
                autoplaySpeed: '=',
                arrows: '=',
                responsive: '='
            },
            controller: ["$element", "$scope", "$timeout", function($element, $scope, $timeout) {
                var config = {
                    centerMode: true,
                    centerPadding: "0px",
                    slidesToShow: 1,
                    infinite: false,
                    variableWidth: true,
                    autoplay: true,
                    autoplaySpeed: 6000,
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
                };

                $.each($scope, function(key, val) {
                    if (typeof val !== 'undefined' && val !== null) {
                       config[key] = val;
                    }
                });

                $element.slick(config);
            }]
        };
    })

;