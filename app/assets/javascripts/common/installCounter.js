angular.module('common.installCounter', [])

    .directive('installCounter', function() {
        return {
            restrict: 'A',
            scope: {
              format: '@'
            },
            controller: ['$element', '$window', '$scope', function($element, $window, $scope) {
                $window.commas = function commas(nStr) {
                    nStr += '';
                    var rgx = /(\d+)(\d{3})/;
                    while (rgx.test(nStr)) { nStr = nStr.replace(rgx, '$1' + ',' + '$2');}
                    return nStr;
                };

                $window.installs_data = function installs_data(data) {
                    STATS = data;
                    var start_count = STATS.start_count;
                    var start_date = STATS.start_date;
                    var average_per_day = STATS.average_per_day;
                    var single_pace = 1/(average_per_day/24/60/60)*1000;
                    var today_date = Math.round((new Date()).getTime() / 1000);
                    var date_difference_seconds = Math.abs(today_date - start_date);
                    var date_difference_days_not_round = (date_difference_seconds / 86400);
                    var corrected_total_downloads_not_round = Math.round(start_count + (average_per_day*date_difference_days_not_round));

                    $($element[0]).counter({
                        direction: "up",
                        format: $scope.format,
                        stop: "9,999,999,999",
                        initial: commas(corrected_total_downloads_not_round)
                    });
                };

                $.getScript('//commondatastorage.googleapis.com/installs.youversion.com/stats_jsonp.js');
            }]
        };
    })

;