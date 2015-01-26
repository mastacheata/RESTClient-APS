/* ***** BEGIN LICENSE BLOCK *****
Copyright (c) 2015, Paul Gear (gear54rus@gmail.com). All rights reserved.

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

restclient.aps = {
  apiCallBody: null,
  lastFetch: null,
  showMsg: function(message, type) {
    $('#aps-msg-container').css('color', type ? 'red' : 'green').text(moment().format('[[]HH:mm:ss[]] ') + message);
  },
  refreshToken: function(done, fail) {
    var eAPIUrl = $('#poa-api-url'),
      eAPIUser = $('#poa-api-user'),
      eAPIPass = $('#poa-api-password'),
      eParams = $('#aps-token-type-params'),
      eToken = $('#aps-token'),
      headers = [],
      body = restclient.aps.apiCallBody(eParams.val());
    if (!body)
      return;
    if (eAPIUser.val()) {
      headers.push(['Authorization', 'Basic ' + btoa(eAPIUser.val() + ':' + eAPIPass.val()).replace(/.{76}(?=.)/g, '$&\n')]);
    }
    restclient.http.sendRequest('POST', eAPIUrl.val(), headers, 'text/xml', body, {
      onprogress: restclient.http.onprogress,
      onload: function() {
        var response = $(this.responseXML);
        if (this.status !== 200) {
          restclient.aps.showMsg('POA API says: ' + this.status + ' ' + this.statusText, true);
        } else if (response.find('name:contains("error_message")').length) {
          restclient.aps.showMsg('POA API says: ' + response.find('name:contains("error_message") + value > string').text(), true);
        } else {
          eToken.val(response.find('name:contains("aps_token") + value > string').text());
          restclient.aps.showMsg('New token acquired!');
          restclient.aps.lastFetch = moment();
        }
        restclient.main.updateProgressBar(-1);
        if (done)
          done();
      },
      onerror: function() {
        restclient.aps.showMsg('POA API says: ' + this.status + ' ' + this.statusText, true);
        restclient.main.updateProgressBar(-1);
        if (fail)
          fail();
      }
    });
  }
};