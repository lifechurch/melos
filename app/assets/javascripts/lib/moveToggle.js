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

                // make visible
                $this.show();

                // slide down to normal position
                $this.stop().animate({top: 0}, options.speed, options.complete);

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

                // slide up to -height
                $this.stop().animate({top: -($this.outerHeight())}, options.speed, function(){
                  // hide once animation is complete
                  $this.hide();
                  options.complete();
                });

                // $this.slideUp(options.speed, options.complete);
          });
      }
  });
})(jQuery);