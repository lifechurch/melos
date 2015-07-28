/* ng-picky v0.1.2 | (c) 2015 Dan Prince | MIT */
angular.module('ngPicky', [])

/**
 * @ngdoc directive
 * @name picker
 *
 * @description
 * Need to figure out description a bit first
 */
.directive('picker', ['Color', function(Color) {
  return {
    restrict: 'EA',
    scope: {
      color: '=',
      pick: '&'
    },
    controller: ['$scope', function($scope) {
      // defaults
      $scope.hue = 0;
      $scope.color = Color.create(255, 255, 255);

      $scope.selectColor = function(color) {
        $scope.color = color;

        $scope.pick({
          $color: color
        });
      };
    }],
    template:
    "<div class='picker'> \
      <div class='picker-wrapper'> \
        <color-space hue='hue' pick='selectColor($color)'></color-space> \
        <hue-space hue='hue'></hue-space> \
      </div> \
      <converters color='color'></converters> \
    </div>"
  };
}])

/**
 * @ngdoc directive
 * @name colorSpace
 *
 * @description
 * Allows the user to select a color from the main colorspace.
 * Requires a hue value in order to generate the colorspace,
 * then listens for mouse events in order to move the cursor
 * around the space.
 */
.directive('colorSpace', ['Widgets', 'Color', 'ConvertColor', 'PickerUtils',
                          'ColorCache',
  function(Widgets, Color, ConvertColor, PickerUtils, ColorCache) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        hue: '=',
        pick: '&'
      },
      template: "<section class='picker-colorspace'></section>",
      link: function(scope, element) {
        var space = Widgets.canvas(),
            canvas = space.canvas,
            context = space.context,
            cursor = Widgets.cursor('&#9675;');

        scope.$watchGroup(['hue', 'show'], function() {
          console.log("Something changed");
          scope.repaint();
          scope.select();
        });

        // Pick the color at the cursor
        // (relies on cursor state
        // rather than arguments)
        scope.select = function() {
          var x, y, data, rgb, hex;

          // get cursor's position
          x = PickerUtils.stripPx(cursor.element.style.left);
          y = PickerUtils.stripPx(cursor.element.style.top);
          data = context.getImageData(x, y, 1, 1).data;

          // expose $color for select expression
          scope.pick({
            $color: Color.create(data[0], data[1], data[2])
          });
        };

        // move a cursor based on a mouse event
        // expects to be called with `this` set
        // to the parent element.
        scope.moveCursor = function(event) {
          var bounds = this.getBoundingClientRect(),
              x = event.pageX - bounds.left,
              y = event.pageY - bounds.top;

          // update cursor's position
          cursor.element.style.left = x + 'px';
          cursor.element.style.top  = y + 'px';

          // pick the color at this position
          scope.select();

          // click needs to trigger scope digest
          scope.$apply();
        };

        // if mousedown move cursor
        scope.mouseMove = function(event) {
          if(scope.mousedown) {
            scope.moveCursor.call(this, event);
          }
        };

        // toggle mouse state
        scope.mouseToggle = function(mousedown) {
          scope.mousedown = mousedown;
        };

        // resize canavas
        scope.resize = function() {
          canvas.width = canvas.height = element.prop('offsetWidth');
        };

        // redraw and check from cache
        scope.repaint = function() {
          var imageData = ColorCache.get(scope.hue);

          // attempt to use cache
          if(imageData) {
            context.putImageData(imageData, 0, 0);
          // otherwise draw from scratch
          } else {
          	if (canvas.width && canvas.height) {
	            scope.paint();
	            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	            ColorCache.set(scope.hue, imageData);
	      }
          }
        };

        // redraw space
        scope.paint = function() {
          var h, s, l, x, y, gradient, cache;

          h = scope.hue;
          s = 0;
          l = 0;

          for(y = 0; y < canvas.height; y++) {
            l = 100 - ((y / canvas.height) * 100);

            gradient = context.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'hsl(' + h + ', 0%, ' + l + '%)');
            gradient.addColorStop(1, 'hsl(' + h + ', 100%, ' + l + '%)');

            context.fillStyle = gradient;
            context.fillRect(0, y, canvas.width, 1);
          }

        };

        scope.resize();
        scope.mousedown = false;
        scope.paint();

        element.append(canvas);
        element.append(cursor.element);

        canvas.addEventListener('mouseup',   scope.mouseToggle.bind(null, false));
        canvas.addEventListener('mousedown', scope.mouseToggle.bind(null, true));
        canvas.addEventListener('mousemove', scope.mouseMove);
        canvas.addEventListener('click',     scope.moveCursor);
      }
    };
  }
])


/**
 * @ngdoc directive
 * @name colorSpace
 *
 * @description
 * Provides a canvas from which the user can select a hue
 * in order to generate a colorspace. Is drawn initially
 * from the link function, then listens for mouse events
 * in order to move the cursor around the space.
 */
.directive('hueSpace', ['Widgets', 'PickerUtils', function(Widgets, PickerUtils) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      hue: '=',
      pick: '&'
    },
    template: "<aside class='picker-huespace'></aside>",
    link: function(scope, element) {
      var space = Widgets.canvas(),
          canvas = space.canvas,
          context = space.context,
          cursor = Widgets.cursor('&#9654;');

      // Pick the color at the cursor
      // (relies on cursor state
      // rather than arguments)
      scope.select = function() {
        // get cursor's position
        var y = PickerUtils.stripPx(cursor.element.style.top);

        // pick the color at this position
        scope.hue = Math.round((y / canvas.height) * 360);

        // click needs to trigger scope digest
        scope.$apply();
      };

      // move a cursor based on a mouse event
      // expects to be called with `this` set
      // to the parent element.
      scope.moveCursor = function(event) {
        var bounds = this.getBoundingClientRect(),
            y = event.pageY - bounds.top;

        // update cursor's position
        cursor.element.style.top = y + 'px';
        scope.select();
        scope.$apply();
      };

      // if mousedown move cursor
      scope.mouseMove = function(event) {
        if(scope.mousedown) {
          scope.moveCursor.call(this, event);
        }
      };

      // toggle mouse state
      scope.mouseToggle = function(mousedown) {
        scope.mousedown = mousedown;
      };

      // resize canavas
      scope.resize = function() {
        canvas.width = element.prop('offsetWidth');
        canvas.height = element.prop('offsetHeight');
      };

      // redraw space
      scope.paint = function() {
        var h = 0;

        for(y = 0; y < canvas.height; y++) {
          // calculate lightness
          h = ((y / canvas.height) * 360);
          context.fillStyle = 'hsl(' + h + ', 100%, 50%)';
          context.fillRect(0, y, canvas.width, 1);
        }
      };

      scope.resize();
      scope.mousedown = false;
      scope.paint();

      element.append(canvas);
      element.append(cursor.element);

      canvas.addEventListener('mouseup',   scope.mouseToggle.bind(null, false));
      canvas.addEventListener('mousedown', scope.mouseToggle.bind(null, true));
      canvas.addEventListener('mousemove', scope.mouseMove);
      canvas.addEventListener('click',     scope.moveCursor);
    }
  };
}])

/**
 * @ngdoc directive
 * @name converters
 *
 * @description
 * Converts a color object into other color
 * representations (e.g. hex, hsl and rgb).
 *
 * TODO Currently only does Hex.
 */
.directive('converters', function() {
  return {
    restrict: 'E',
    scope: {
      color: '='
    },
    template:
    "<section class='picker-input'> \
      <div class='picker-row'> \
        <span class='picker-prefix'>#</span> \
        <input type='text' placeholder='FFFFFF' \
               ng-value='color | toUnprefixedHex'/> \
      </div> \
    </section>"
  };
})

.filter('toHex', ['Color', function(Color) {
  return function(color) {
    if(!color) {
      color = Color.default();
    }
    return color.toHex();
  };
}])

.filter('toUnprefixedHex', function() {
  return function(color) {
    return color.toUnprefixedHex();
  };
})

.filter('toRGB', function() {
  return function(color) {
    return ['rgb(',
      color.toRGB().join(','),
    ')'].join('');
  };
})

.filter('toHSL', function() {
  return function(color) {
    return ['hsl(',
      color.toHSL().join(','),
    ')'].join('');
  };
})

/**
 * @ngdoc service
 * @name Color
 *
 * @description
 * A swiss army knife service for dealing with
 * colors. Provides an internal Color class
 * with conversion methods, as well as a factory
 * method for creating Color instances.
 *
 * @example
 * Color.create(r, g, b)
 *  .toHex();
 */
.service('Color', ['Hex', function(Hex) {

  // Color Class
  function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  // Returns an array representation of a color
  Color.prototype.toRGB = function() {
    return [this.r, this.g, this.b];
  };

  // Converts a color to a Hex string
  Color.prototype.toHex = function() {
    return '#' + this.toUnprefixedHex();
  };

  // Converts to hex string without #
  Color.prototype.toUnprefixedHex = function() {
    return this.toRGB()
      .map(this.decToHex)
      .join('');
  };

  // Converts a color to HSL where:
  // H is in the range [0, 360]
  // S, L are in the range [0, 1]
  Color.prototype.toHSL = function() {
    var r, g, b, min, max, h, s, l, delta, dr, dg, rb;

    r = this.r / 255;
    g = this.g / 255;
    b = this.b / 255;

    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    delta = max - min;

    l = (max + min) / 2;

    if(delta === 0) {
      h = 0;
      s = 0;
    } else {
      if(l < 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
        dr = (((max - r) / 6) + (delta / 2)) / delta;
        dg = (((max - g) / 6) + (delta / 2)) / delta;
        db = (((max - b) / 6) + (delta / 2)) / delta;

        if      (r === max) h = db - dg;
        else if (g === max) h = (1/3) + dr - db;
        else                h = (2/3) + dg - dr;

        if(h < 0) h += 1;
        if(h > 1) h -= 1;
      }
    }

    return [h * 360, s, l];
  };

  // Convert a decimal to a padded hex
  Color.prototype.decToHex = function(dec) {
    return Hex.pad(dec.toString(16));
  };

  // Factory wrapper for creating instances
  this.create = function(r, g, b) {
    return new Color(r, g, b);
  };

  this.default = function() {
    return new Color(255, 255, 255);
  };
}])

/**
 * @ngdoc service
 * @name ConvertColor
 *
 * @description
 * A complementary service for converting
 * other color formats into Color instances
 * provided by the Color service.
 *
 * @example
 * ConvertColor.fromHSL(h, s, l)
 *  .toHex();
 */
.service('ConvertColor', ['Color', 'Hex', function(Color, Hex) {

  // Create a color from primitive rgb values
  // expected within the range [0, 255]
  this.fromRGB = function(r, g, b) {
    return Color.create(r, g, b);
  };

  // Create a color from a hex string
  // Hash can be omitted and string
  // can be full form (6 chars) or short
  // form (3 chars).
  this.fromHex = function(dirty) {
    var hex = Hex.normalize(dirty),
        rgb = [],
        part = null,
        index = 0;

    for(index = 0; index < 6; index += 2) {
      part = hex.slice(index, index + 2);
      rgb.push(parseInt(part, 16));
    }

    return Color.create.apply(null, rgb);
  };

  // Create a color from HSL values
  // H expected within the range [0, 360]
  // S, L expected within the range [0, 1]
  this.fromHSL = function(h, s, l) {
    var chroma, hue, x, rgb;

    chroma = (1 - Math.abs((2 * l) - 1)) * s;
    hue = h / 60;
    x = chroma * (1 - Math.abs((hue % 2) - 1));

    if(hue >= 0 && hue < 1) rgb = [chroma, x, 0];
    if(hue >= 1 && hue < 2) rgb = [x, chroma, 0];
    if(hue >= 2 && hue < 3) rgb = [0, chroma, x];
    if(hue >= 3 && hue < 4) rgb = [0, x, chroma];
    if(hue >= 4 && hue < 5) rgb = [x, 0, chroma];
    if(hue >= 5 && hue < 6) rgb = [chroma, 0, x];

    m = l - (chroma / 2);

    return Color.create.apply(null, rgb.map(function(part) {
      return part + m;
    }));
  };
}])

/**
 * @ngdoc service
 * @name Hex
 *
 * @description
 * Utility methods for working
 * with hexadecimal color strings.
 *
 */
.service('Hex', function() {
  this.validator = new RegExp(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

  this.validate = function(hex) {
    var matches = hex.match(this.validator);

    if(matches) {
      return matches.pop();
    } else {
      return null;
    }
  };

  this.pad = function(hex) {
    return ('00' + hex).slice(-2);
  };

  this.normalize = function(dirty) {
    var hex = this.validate(dirty);

    if(hex.length === 3) {
      return hex.split('')
        .map(duplicate)
        .reduce(concat, [])
        .join('');
    } else {
      return hex;
    }

    // concatenate a series of sub arrays
    function concat(str, substr) {
      str.concat(substr);
    }

    // duplicate an item into an array
    function duplicate(a) {
      return  [a, a];
    }
  };
})

/**
 * @ngdoc service
 * @name Widgets
 *
 * @description
 * Simple service that builds instances
 * of widgets that are common across multiple
 * directives.
 */
.service('Widgets', function() {

  this.cursor = function(character) {
    var cursor = document.createElement('div');
    cursor.innerHTML = character;
    cursor.setAttribute('class', 'picker-cursor');

    cursor.style.position = 'absolute';
    cursor.style.top = 0;
    cursor.style.left = 0;

    return {
      element: cursor,
      x: 0,
      y: 0
    };
  };

  this.canvas = function() {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    return {
      canvas: canvas,
      context: context
    };
  };

})

/**
 * @ngdoc service
 * @name ColorCache
 *
 * @description
 * Keep cached versions of the imgData for
 * any given hue. This can be looked up in
 * future, rather than redrawing on the canvas.
 */
.service('ColorCache', function() {
  var cache = {};

  this.get = function(hue) {
    return cache[hue];
  };

  this.set = function(hue, imgData) {
    if(!cache[hue]) {
      cache[hue] = imgData;
    }
  };
})

/**
 * @ngdoc service
 * @name PickerUtils
 *
 * @description
 * Common utility methods
 */
.service('PickerUtils', function() {
  // removes 'px' from the end of a string
  this.stripPx = function(str) {
    return str.slice(0, str.length - 2);
  };
});

