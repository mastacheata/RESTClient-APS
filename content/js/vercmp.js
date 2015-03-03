/*!
* isSemVer - v0.1 - 9/05/2010
* http://benalman.com/
* http://semver.org/
*
* Copyright (c) 2010 "Cowboy" Ben Alman
* Dual licensed under the MIT and GPL licenses.
* http://benalman.com/about/license/
*/ 

'use strict';

restclient.vercmp = (function() {
  var re = /^(<|>|[=!<>]=)?\s*(\d+(?:\.\d+){0,2})([a-z][a-z0-9\-]*)?$/i;

  function get_val(str, include_cmp) {
    var matches = (str + '').match(re);

    return matches ? (include_cmp ? (matches[1] || '==') : '') + '"' + (matches[2] + '.0.0').match(/\d+(?:\.\d+){0,2}/)[0].replace(/(?:^|\.)(\d+)/g, function(a, b) {
      return Array(9 - b.length).join(0) + b;
    }) + (matches[3] || '~') + '"' : (include_cmp ? '==0' : 1);
  };

  return function(base_ver) {
    base_ver = get_val(base_ver);
    for (var arg, i = 1; arg = arguments[i++];) {
      if (!(new Function('return ' + base_ver + get_val(arg, 1)))()) {
        return false;
      }
    }
    return true;
  };
})();
