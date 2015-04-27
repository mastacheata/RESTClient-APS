/* ***** BEGIN LICENSE BLOCK *****
Copyright (c) 2007-2012, Chao ZHOU (chao@zhou.fr). All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the author nor the names of its contributors may
      be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ***** END LICENSE BLOCK ***** */

'use strict';

restclient.curl = {
  constructCommand: function (request) {
    var result = 'curl';
    if (typeof request.method !== 'undefined')
      result += ' -X' + request.method;
    result += ' -i';
    if (typeof request.headers !== 'undefined') {
      var headers = '';
      for (var i = 0, header; header = request.headers[i]; i++)
        headers += ' -H\'' + header[0] + ':' + header[1] + '\'';
      if (request.aps.mode)
        headers += ' -H\'APS-Token:' + request.aps.token + '\'';
      result += headers;
    }
    if (typeof request.body !== 'undefined' && request.body !== '')
      result += ' -d \'' + request.body + '\'';
    //TODO escape special chars
    if (typeof request.url !== 'undefined')
      result += ' \'' + request.url + '\'';
    return result;
  },
  constructTokenCommand: function (aps) {
    return 'curl -XPOST' + (aps.user ? (' -u\'' + aps.user + ':' + aps.password + '\'') : '') + ' -d\'' + restclient.aps.apiMethods[aps.type][1](aps.parameters) + '\' \'' + aps.url + '\' 2>/dev/null|tail -n1|sed \'s|^.*aps_token</name><value><string>\\([^<]\\+\\).*$|\\1|\'';
  }
}
