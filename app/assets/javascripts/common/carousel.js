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
                responsive: '=',
                initialSlide: '='
            },
            controller: ["$element", "$scope", "$timeout", function($element, $scope, $timeout) {
                var config = {
                    centerMode: true,
                    centerPadding: "0px",
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
                    if (key[0] !== '$' && typeof val !== 'undefined' && val !== null) {
                       config[key] = val;
                    }
                });

                $element.slick(config);

                if (typeof $scope.initialSlide !== 'undefined' && $scope.initialSlide !== null) {
                    $element.slick('slickGoTo', $scope.initialSlide);
                }

            }]
        };
    })

;