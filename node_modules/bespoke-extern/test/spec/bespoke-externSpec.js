Function.prototype.bind = Function.prototype.bind || require('function-bind');

var bespoke = require('bespoke'),
  extern = require('../../lib/bespoke-extern.js');

describe('bespoke-extern', function() {
  var deck,
    createDeck = function(noargs) {
      var parent = document.createElement('article');
      for (var i = 1; i <= 5; i++) {
        var section = document.createElement('section');
        parent.appendChild(section);
      }

      document.body.appendChild(parent);

      deck = bespoke.from(parent, [
        (noargs ? extern() : extern(bespoke))
      ]);
    },
    destroyDeck = function() {
      deck.fire('destroy');
      var parentNode = deck.parent.parentNode;
      if (parentNode) parentNode.removeChild(deck.parent);
      deck = null;
      delete window.bespoke;
    };

  afterEach(destroyDeck);

  describe('bespoke-extern', function() {
    beforeEach(function() {
      createDeck();
      deck.slide(0);
    });

    it('should export API to global variable named bespoke', function() {
      expect(window.bespoke).not.toBeNull();
      expect(typeof window.bespoke.from).toBe('function');
    });

    it('should provide access to collection of deck instances via bespoke.decks', function() {
      expect(window.bespoke.decks).not.toBeNull();
      expect(Array.isArray(window.bespoke.decks)).toBe(true);
      expect(window.bespoke.decks.length).toBe(1);
      expect(window.bespoke.decks[0]).toBe(deck);
    });

    it('should provide access to last deck instance via bespoke.deck', function() {
      expect(window.bespoke.deck).toBe(deck);
      expect(Array.isArray(window.bespoke.deck.slides)).toBe(true);
      expect(window.bespoke.deck.slides.length).toBe(5);
      expect(deck.slide()).toBe(0);
      window.bespoke.deck.next();
      expect(deck.slide()).toBe(1);
    });

    it('should unregister deck when destroy method is fired', function() {
      expect(window.bespoke.decks.length).toBe(1);
      expect(window.bespoke.decks[0]).toBe(deck);
      deck.fire('destroy');
      expect(window.bespoke.decks.length).toBe(0);
      expect(window.bespoke.deck).toBe(undefined);
    });
  });

  describe('bespoke-extern with no arguments', function() {
    beforeEach(function() {
      createDeck(true);
      deck.slide(0);
    });

    it('should export API to global variable named bespoke', function() {
      expect(window.bespoke).not.toBeNull();
      expect(window.bespoke.from).toBe(undefined);
      expect(window.bespoke.decks).not.toBeNull();
      expect(Array.isArray(window.bespoke.decks)).toBe(true);
    });
  });
});
