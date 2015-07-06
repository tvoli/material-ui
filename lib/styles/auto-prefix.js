'use strict';

var isBrowser = typeof window !== 'undefined';
var Modernizr = isBrowser ? require('../utils/modernizr.custom') : undefined;

module.exports = {

  all: function all(styles) {
    var prefixedStyle = {};
    for (var key in styles) {
      var prefixed = this.singleAll(key);
      for (var index in prefixed) {
        prefixedStyle[prefixed[index]] = styles[key];
      }
    }
    return prefixedStyle;
  },

  set: function set(style, key, value) {
    style[this.single(key)] = value;
  },

  single: function single(key) {
    return isBrowser ? Modernizr.prefixed(key) : key;
  },

  // prefix for all vendors
  singleAll: function test(key) {
    var toPrefix = {
      'borderRadius': ['borderRadius', 'WebkitBorderRadius', 'MozBorderRadius', 'OBorderRadius', 'msBorderRadius'],
      'boxShadow': ['boxShadow', 'WebkitBoxShadow', 'MozBoxShadow', 'OBoxShadow', 'msBoxShadow'],
      'opacity': ['opacity', 'WebkitOpacity', 'MozOpacity', 'OOpacity', 'msOpacity'],
      'transform': ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'],
      'transition': ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition']
    };

    return toPrefix[key] ? toPrefix[key] : [key];
  },

  singleHyphened: function singleHyphened(key) {
    var str = this.single(key);

    return !str ? key : str.replace(/([A-Z])/g, function (str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }

};