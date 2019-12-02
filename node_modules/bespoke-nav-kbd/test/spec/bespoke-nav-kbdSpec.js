Function.prototype.bind = Function.prototype.bind || require('function-bind');

var simulant = require('simulant'),
  bespoke = require('bespoke'),
  navkbd = require('../../lib/bespoke-nav-kbd.js'),
  forms = require('bespoke-forms');

describe('bespoke-nav-kbd', function() {
  var KEY = { spaceBar: 32, pageUp: 33, pageDown: 34, end: 35, home: 36, left: 37, right: 39, h: 72, l: 76 },
    deck,
    inputBox = null,
    createDeck = function() {
      var parent = document.createElement('article');
      for (var i = 1; i <= 5; i++) {
        var slide = document.createElement('section');
        if (i === 1) {
          inputBox = document.createElement('input');
          inputBox.type = 'text';
          slide.appendChild(inputBox);
        }
        parent.appendChild(slide);
      }
      deck = bespoke.from(parent, [
        navkbd(),
        forms()
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
    pressKey = function(which, opts, element) {
      opts = opts ? opts : {};
      opts.which = KEY[which] || which;
      simulant.fire((element || document), 'keydown', opts);
    };

  beforeEach(createDeck);
  afterEach(destroyDeck);

  describe('navigate to next slide', function() {
    beforeEach(function() { deck.slide(0); });

    it('should go to next slide when space bar is pressed', function() {
      pressKey(KEY.spaceBar);
      expect(deck.slide()).toBe(1);
    });

    it('should go to next slide when right arrow is pressed', function() {
      pressKey(KEY.right);
      expect(deck.slide()).toBe(1);
      pressKey(KEY.right, { shiftKey: true});
      expect(deck.slide()).toBe(2);
    });

    it('should go to next slide when page down is pressed', function() {
      pressKey(KEY.pageDown);
      expect(deck.slide()).toBe(1);
      pressKey(KEY.pageDown, { shiftKey: true});
      expect(deck.slide()).toBe(2);
    });

    it('should go to next slide when l is pressed', function() {
      pressKey(KEY.l);
      expect(deck.slide()).toBe(1);
      pressKey(KEY.l, { shiftKey: true});
      expect(deck.slide()).toBe(2);
    });

    it('should not go to next slide when both right arrow and modifier key are pressed', function() {
      pressKey(KEY.right, { altKey: true });
      expect(deck.slide()).toBe(0);
      pressKey(KEY.right, { ctrlKey: true });
      expect(deck.slide()).toBe(0);
    });

    it('should not go to next slide when space bar is pressed in input field', function() {
      pressKey(KEY.spaceBar, {}, inputBox);
      expect(deck.slide()).toBe(0);
    });
  });

  describe('navigate to previous slide', function() {
    beforeEach(function() { deck.slide(2); });

    it('should go to previous slide when left arrow is pressed', function() {
      pressKey(KEY.left);
      expect(deck.slide()).toBe(1);
      pressKey(KEY.left, { shiftKey: true});
      expect(deck.slide()).toBe(0);
    });

    it('should go to previous slide when page up is pressed', function() {
      pressKey(KEY.pageUp);
      expect(deck.slide()).toBe(1);
      pressKey(KEY.pageUp, { shiftKey: true});
      expect(deck.slide()).toBe(0);
    });

    it('should go to previous slide when h is pressed', function() {
      pressKey(KEY.h);
      expect(deck.slide()).toBe(1);
      pressKey(KEY.h, { shiftKey: true});
      expect(deck.slide()).toBe(0);
    });

    it('should go to previous slide when shift and space bar are pressed', function() {
      pressKey(KEY.spaceBar, { shiftKey: true });
      expect(deck.slide()).toBe(1);
    });

    it('should not go to previous slide when both left arrow and modifier key are pressed', function() {
      pressKey(KEY.left, { altKey: true});
      expect(deck.slide()).toBe(2);
      pressKey(KEY.left, { ctrlKey: true});
      expect(deck.slide()).toBe(2);
    });

    it('should not go to previous slide when shift and space bar are pressed in input field', function() {
      pressKey(KEY.spaceBar, {}, inputBox);
      expect(deck.slide()).toBe(2);
    });
  });

  describe('navigate to first slide', function() {
    beforeEach(function() { deck.slide(2); });

    it('should go to first slide when home is pressed', function() {
      pressKey(KEY.home);
      expect(deck.slide()).toBe(0);
    });
  });

  describe('navigate to last slide', function() {
    beforeEach(function() { deck.slide(0); });

    it('should go to last slide when end is pressed', function() {
      pressKey(KEY.end);
      expect(deck.slide()).toBe(deck.slides.length - 1);
    });
  });
});
