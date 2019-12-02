module.exports = function(opts) {
  return function(deck) {
    opts = opts && (opts.object || opts.name || opts.scope) ? opts : { object: opts };
    var bespoke = opts.object, name = opts.name || 'bespoke', scope = opts.scope || window;
    if (bespoke) scope[name] = bespoke;
    else if (scope[name]) bespoke = scope[name];
    else bespoke = (scope[name] = {});
    (Array.isArray(bespoke.decks) ? bespoke.decks : (bespoke.decks = [])).push(bespoke.deck = deck);
    deck.on('destroy', function() {
      var idx = bespoke.decks.indexOf(deck);
      if (idx >= 0) bespoke.decks.splice(idx, 1);
      delete bespoke.deck;
    });
  };
};
