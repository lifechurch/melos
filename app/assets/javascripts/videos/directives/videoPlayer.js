angular.module('videos.videoPlayer', [])

    .directive('videoPlayer', [ function(FootnoteCounter) {
        return {
            restrict: 'A',
            scope: {
                poster: '@',
                publisherId: '@',
                publisherGaTrackingId: '@',
                videoRefId: '@'
            },
            controller: ['$scope', '$element',  function($scope, $element) {
                videojs($element.attr("id"), { "controls": true, "autoplay": false, "preload": "auto", "width": '100%', "height": '100%', "poster": $scope.poster }).ready(function(){

                    var publisher_id = $scope.publisherId;

                    //only setup tracking at the moment for Jesus Film (id: 1)
                    /*
                    if (publisher_id == 1) {
                        // create a custom tracker for video events
                        var tracker = $scope.gat._createTracker($scope.publisherGaTrackingId,"videoTracker");

                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                            return v.toString(16);
                        });

                        // Keep this around in case we ever need to wrap the tracking code.
                        var trackVideoEvent = function( fn ) {
                            fn();
                        };

                        var videoStarted  = false;
                        var startTime     = 0;

                        // Array to keep track of start/end segments that a user has watched.
                        // Each item in the array is an object: {start: 0, end: 2.4}
                        // Custom total method setup to iterate through items and total up all segments into total time watched.
                        var playTimes = [];

                        // Create a named function so that we can reassign the function later on after its cleared.
                        var playTimeTotal = function() {
                            var timeWatched = 0;
                            for(var i = 0; i < this.length; i++) {
                                timeWatched += (this[i].end - this[i].start);
                            }
                            return Math.round(timeWatched);
                        }
                        playTimes.total = playTimeTotal;

                        // the videojs object
                        player = this;

                        // All video player api handlers below:
                        // - onPlay: any time the video starts playing
                        // - onPause: any time the video is paused
                        // - onComplete: when the video has reached the end
                        player.on("play", function(){
                            if(videoStarted == false) {
                                videoStarted = true;
                            }
                            // set the new start time every time the video begins playing
                            startTime = jwplayer().getPosition()
                        });

                        player.on("seeked", function(){
                            playTimes.push({start: startTime, end: jwplayer().getPosition()});
                            startTime = event.offset;
                            // event.offset is not super accurate - more than likely due to encoding with low number of key frames.
                        });

                        player.on("pause", function(){
                            playTimes.push({start: startTime, end: jwplayer().getPosition()});
                        });

                        player.on("ended", function(){

                            playTimes.push({start: startTime, end: jwplayer().getPosition()})

                            trackVideoEvent( function() {
                                var timestamp = Math.round((new Date()).getTime() / 1000);
                                _gaq.push(
                                    ['videoTracker._setCustomVar',1,'apiSessionId', guid],
                                    ['videoTracker._trackEvent', $scope.videoRefId , 'mediaViewTime', playTimes.total().toString() , 0],
                                    ['videoTracker._trackEvent', $scope.videoRefId , 'mediaComplete', timestamp.toString() , 0],
                                    ['videoTracker._trackEvent', $scope.videoRefId , 'domain', 'YouVersion', 0]
                                );
                            });

                            // Reset to initial values.
                            videoStarted    = false;
                            startTime       = 0;
                            playTimes       = [];
                            playTimes.total = playTimeTotal;
                        });

                        $scope.$on('$destroy', function() {
                            // dont track anything if the video is not in a started/playing state
                            if(videoStarted != false) {
                                playTimes.push({start: startTime, end: jwplayer().getPosition()})

                                trackVideoEvent( function() {
                                    var timestamp = Math.round((new Date()).getTime() / 1000);
                                    _gaq.push(
                                        ['videoTracker._setCustomVar',1,'apiSessionId', guid],
                                        ['videoTracker._trackEvent', $scope.videoRefId , 'mediaViewTime', playTimes.total().toString() , 0],
                                        ['videoTracker._trackEvent', $scope.videoRefId , 'mediaComplete', timestamp.toString() , 0],
                                        ['videoTracker._trackEvent', $scope.videoRefId , 'domain', 'YouVersion', 0]
                                    );
                                });
                            }
                        });
                    }
                    */
                });
            }]
        }
    }])

;