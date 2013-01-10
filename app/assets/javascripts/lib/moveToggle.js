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

                // ensure position is -height before showing

                // make visible

                // slide down to normal position

                $this.slideDown(options.speed, options.complete);
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
                $this.slideUp(options.speed, options.complete);

                // hide
          });
      }
  });
})(jQuery);