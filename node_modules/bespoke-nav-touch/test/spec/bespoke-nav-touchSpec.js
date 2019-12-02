Function.prototype.bind = Function.prototype.bind || require('function-bind');

var bespoke = require('bespoke'),
  navtouch = require('../../lib/bespoke-nav-touch.js');

describe('bespoke-nav-touch', function() {
  var DEFAULT_THRESHOLD = Math.round(50 / window.devicePixelRatio),
    deck,
    createDeck = function(opts) {
      var parent = document.createElement('article');
      for (var i = 1; i <= 5; i++) {
        var slide = document.createElement('section');
        parent.appendChild(slide);
      }
      deck = bespoke.from(parent, [
        navtouch(opts)
      ]);
    },
    destroyDeck = function() {
      deck.fire('destroy');
      var parentNode = deck.parent.parentNode;
      if (parentNode) {
        parentNode.removeChild(deck.parent);
      }
      deck = null;
    },
    touchEvent = function(type, x, y, multiple) {
      var e = document.createEvent('CustomEvent');
      e.initEvent('touch' + type, true, true);
      e.touches = multiple ? [{ pageX: x, pageY: y }, { pageX: x + 1, pageY: y + 1}] : [{ pageX: x, pageY: y }];
      deck.parent.dispatchEvent(e);
    },
    swipe = function(axis, amount, multiple) {
      touchEvent('start', axis == 'x' ? amount : 0, axis == 'x' ? 0 : amount, multiple);
      touchEvent('move', 0, 0, multiple);
      touchEvent('end', 0, 0, multiple);
    };

  afterEach(destroyDeck);

  [undefined, { threshold: 50 }, { axis: 'x' }, { axis: 'y' }].forEach(function(opts) {
    describe('with options ' + JSON.stringify(opts), function() {
      var axis = (opts || {}).axis !== undefined ? opts.axis : 'x',
        threshold = (opts || {}).threshold !== undefined ? opts.threshold : DEFAULT_THRESHOLD;
      beforeEach(function() { createDeck(opts); });

      describe('navigate to next slide', function() {
        var direction = axis === 'x' ? 'right to left' : 'bottom to top';
        beforeEach(function() { deck.slide(1); });

        it('should go to next slide when swiping ' + direction, function() {
          swipe(axis, threshold + 1);
          expect(deck.slide()).toBe(2);
        });

        it('should not go to next slide when swiping ' + direction + ' less than threshold', function() {
          swipe(axis, threshold - 1);
          expect(deck.slide()).toBe(1);
        });

        it('should not go to next slide when swiping ' + direction + ' using multiple touches', function() {
          swipe(axis, threshold + 1, true);
          expect(deck.slide()).toBe(1);
        });
      });

      describe('navigate to previous slide', function() {
        var direction = axis === 'x' ? 'left to right' : 'top to bottom';
        beforeEach(function() { deck.slide(1); });

        it('should go to previous slide when swiping ' + direction, function() {
          swipe(axis, 0 - (threshold + 1));
          expect(deck.slide()).toBe(0);
        });

        it('should not go to next slide when swiping ' + direction + ' less than threshold', function() {
          swipe(axis, 0 - (threshold - 1));
          expect(deck.slide()).toBe(1);
        });

        it('should not go to next slide when swiping ' + direction + ' using multiple touches', function() {
          swipe(axis, 0 - (threshold + 1), true);
          expect(deck.slide()).toBe(1);
        });
      });
    });
  });
});
