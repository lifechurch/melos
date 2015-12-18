angular.module('common.carousel', [])

    .directive('carousel', function() {
        return {
            restrict: 'AC',
            controller: ["$element", "$scope", "$timeout", function($element, $scope, $timeout) {
                // this can be refactored to be generic/reuseable and pass in carousel setup vals
                // at the moment it is only used on the app page review carousel
                $element.slick({
                    centerMode: true,
                    centerPadding: "0px",
                    slidesToShow: 1,
                    infinite: false,
                    variableWidth: true,
                    autoplay: true,
                    autoplaySpeed: 6000,
                    arrows: false,
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