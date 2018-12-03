angular.module('yv.moments.planCarousel', [])

    .directive('momentPlanCarousel', function() {
        return {
            restrict: 'AC',
            controller: ["$element", "$scope", "$timeout", function($element, $scope, $timeout) {
                
              $scope.data.object.avatar = "/assets/plans.svg";

              var plans = [];
                $element.addClass('featured-rp-box');
                $element.slick({
                    centerMode: true,
                    centerPadding: "0px",
                    slidesToShow: 3,
                    infinite: true,
                    variableWidth: true,
                    responsive: [
                        {
                            breakpoint: 768,
                            settings: {
                                arrows: true,
                                centerPadding: "10px",
                                slidesToShow: 1
                            }
                        }
                    ]
                });

                var stopWatching = $scope.$watch('data.object.plans', function(newVal, oldVal) {
                    if (newVal && newVal.length) {
                        plans = newVal;
                        for (var i = 0; i < plans.length; i++) {
                            var plan = plans[i];
                            var slickSlide = "" +
                                "<div class='featured-rp-box-plan'>" +
                                "<a href='" + plan.path + "' target='_self'>" +
                                "<img src='" + plan.image_url + "'>" +
                                "<p>" + plan.name + "</p>" +
                                "<div class='length'>" + plan.formatted_length + "</div>" +
                                "</a></div>";
                            $element.slick('slickAdd', slickSlide);
                        }
                        $element.slick('setPosition');
                        stopWatching();
                    }
                });
            }]
        };
    })

;