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
            speed: speed || 400,
            complete: complete || null
          };

          return this.each(function() {
                var $this = $(this);
                // // initialize the original top to current position
                // if ($this.data('orig-top') == null){
                //   var _top = parseInt($this.css('top'));
                //   if (isNaN(_top)){ _top = $this.css('top') }
                //   $this.data('orig-top', _top);
                // }

                // // ensure it's up
                // $this.css({top: $this.data('orig-top') - $this.outerHeight()});

                // // make visible
                // $this.show();

                // // slide down to normal position
                // console.log(options);
                // $this.stop().animate({top: $this.data('orig-top')}, options.speed);

                $this.slideDown(options.speed, options.complete);
          });
      },

      moveUp: function(speed, complete) {

          var options = {
            speed: speed || 400,
            complete: complete || null
          };

          return this.each(function() {
                var $this = $(this);
                // // initialize the original top to current position
                // if ($this.data('orig-top') == null){
                //   var _top = parseInt($this.css('top'));
                //   if (isNaN(_top)){ _top = $this.css('top') }
                //   $this.data('orig-top', _top);
                // }

                // // slide up to -height
                // $this.stop().animate({top: $this.data('orig-top') - $this.outerHeight()}, options.speed, function(){
                //   // hide once animation is complete
                //   $this.hide();
                //   if(options.complete){ options.complete(); }
                // });

                $this.slideUp(options.speed, options.complete);
          });
      }
  });
})(jQuery);