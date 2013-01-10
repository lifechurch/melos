/*
*  Character Count Plugin - jQuery plugin
*  Menu slide animation that animates position instead of height
*  written by Evan Prothro
*
*  Dual licensed under the MIT (MIT-LICENSE.txt)
*  and GPL (GPL-LICENSE.txt) licenses.
*
*  Built for jQuery library
*  http://jquery.com
*/

(function($){
  $.fn.extend({
      moveDown: function(speed, complete) {

          var options = {
            speed: speed || 'default',
            complete: complete || null
          };

          return this.each(function() {
                var $this = $(this);
                // initialize the original top to current position
                if (!$this.data('orig-top')){
                  $this.data('orig-top', $this.position().top);
                }

                // ensure it's up
                $this.css({top: $this.data('orig-top') - $this.outerHeight()});

                // make visible
                $this.show();

                // slide down to normal position
                $this.stop().animate({top: $this.data('orig-top')}, options.speed, options.complete);

                // $this.slideDown(options.speed, options.complete);
          });
      },

      moveUp: function(speed, complete) {

          var options = {
            speed: speed || 'default',
            complete: complete || null
          };

          return this.each(function() {
                var $this = $(this);
                // initialize the original top to current position
                if (!$this.data('orig-top')){
                  $this.data('orig-top', $this.position().top);
                }

                // slide up to -height
                $this.stop().animate({top: $this.data('orig-top') - $this.outerHeight()}, options.speed, function(){
                  // hide once animation is complete
                  $this.hide();
                  if(options.complete){ options.complete(); }
                });

                // $this.slideUp(options.speed, options.complete);
          });
      }
  });
})(jQuery);