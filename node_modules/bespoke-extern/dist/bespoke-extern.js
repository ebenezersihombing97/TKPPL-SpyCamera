/*!
 * bespoke-extern v1.0.0
 *
 * Copyright 2016, Dan Allen
 * This content is released under the MIT license
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.bespoke||(g.bespoke = {}));g=(g.plugins||(g.plugins = {}));g.extern = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});