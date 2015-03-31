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
  apiMethods: {
    'getAccountToken': [
      'account_id[, subscription_id]',
      function(input) {
        var body = atob('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPG1ldGhvZENhbGw+CiAgICA8bWV0aG9kTmFtZT5wZW0uQVBTLmdldEFjY291bnRUb2tlbjwvbWV0aG9kTmFtZT4KICAgIDxwYXJhbXM+CiAgICAgICAgPHBhcmFtPgogICAgICAgICAgICA8dmFsdWU+CiAgICAgICAgICAgICAgICA8c3RydWN0PgogICAgICAgICAgICAgICAgICAgIDxtZW1iZXI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxuYW1lPmFjY291bnRfaWQ8L25hbWU+CiAgICAgICAgICAgICAgICAgICAgICAgIDx2YWx1ZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpND5BQ0NPVU5UX0lEPC9pND4KICAgICAgICAgICAgICAgICAgICAgICAgPC92YWx1ZT4KICAgICAgICAgICAgICAgICAgICA8L21lbWJlcj4KICAgICAgICAgICAgICAgICAgICA8bWVtYmVyPgogICAgICAgICAgICAgICAgICAgICAgICA8bmFtZT5zdWJzY3JpcHRpb25faWQ8L25hbWU+CiAgICAgICAgICAgICAgICAgICAgICAgIDx2YWx1ZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpND5TVUJTQ1JJUFRJT05fSUQ8L2k0PgogICAgICAgICAgICAgICAgICAgICAgICA8L3ZhbHVlPgogICAgICAgICAgICAgICAgICAgIDwvbWVtYmVyPgogICAgICAgICAgICAgICAgPC9zdHJ1Y3Q+CiAgICAgICAgICAgIDwvdmFsdWU+CiAgICAgICAgPC9wYXJhbT4KICAgIDwvcGFyYW1zPgo8L21ldGhvZENhbGw+Cg=='),
          match = input.match(/\d+/g);
        if (!match) {
          restclient.aps.showMsg('Unable to parse \'account_id\'', true);
          return;
        }
        return body.replace('ACCOUNT_ID', parseInt(match[0], 10)).replace('SUBSCRIPTION_ID', match[1] ? parseInt(match[1], 10) : 0);
      }
    ],
    'getUserToken': [
      'user_id[, subscription_id]',
      function(input) {
        var body = atob('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPG1ldGhvZENhbGw+CiAgICA8bWV0aG9kTmFtZT5wZW0uQVBTLmdldFVzZXJUb2tlbjwvbWV0aG9kTmFtZT4KICAgIDxwYXJhbXM+CiAgICAgICAgPHBhcmFtPgogICAgICAgICAgICA8dmFsdWU+CiAgICAgICAgICAgICAgICA8c3RydWN0PgogICAgICAgICAgICAgICAgICAgIDxtZW1iZXI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxuYW1lPnVzZXJfaWQ8L25hbWU+CiAgICAgICAgICAgICAgICAgICAgICAgIDx2YWx1ZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpND5VU0VSX0lEPC9pND4KICAgICAgICAgICAgICAgICAgICAgICAgPC92YWx1ZT4KICAgICAgICAgICAgICAgICAgICA8L21lbWJlcj4KICAgICAgICAgICAgICAgICAgICA8bWVtYmVyPgogICAgICAgICAgICAgICAgICAgICAgICA8bmFtZT5zdWJzY3JpcHRpb25faWQ8L25hbWU+CiAgICAgICAgICAgICAgICAgICAgICAgIDx2YWx1ZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpND5TVUJTQ1JJUFRJT05fSUQ8L2k0PgogICAgICAgICAgICAgICAgICAgICAgICA8L3ZhbHVlPgogICAgICAgICAgICAgICAgICAgIDwvbWVtYmVyPgogICAgICAgICAgICAgICAgPC9zdHJ1Y3Q+CiAgICAgICAgICAgIDwvdmFsdWU+CiAgICAgICAgPC9wYXJhbT4KICAgIDwvcGFyYW1zPgo8L21ldGhvZENhbGw+Cg=='),
          match = input.match(/\d+/);
        if (!match) {
          restclient.aps.showMsg('Unable to parse \'user_id\'', true);
          return;
        }
        return body.replace('USER_ID', parseInt(match[0], 10)).replace('SUBSCRIPTION_ID', match[1] ? parseInt(match[1], 10) : 0);
      }
    ],
    'getApplicationInstanceToken': [
      'application_instance_id',
      function(input) {
        var body = atob('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPG1ldGhvZENhbGw+CiAgICA8bWV0aG9kTmFtZT5wZW0uQVBTLmdldEFwcGxpY2F0aW9uSW5zdGFuY2VUb2tlbjwvbWV0aG9kTmFtZT4KICAgIDxwYXJhbXM+CiAgICAgICAgPHBhcmFtPgogICAgICAgICAgICA8dmFsdWU+CiAgICAgICAgICAgICAgICA8c3RydWN0PgogICAgICAgICAgICAgICAgICAgIDxtZW1iZXI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxuYW1lPmFwcGxpY2F0aW9uX2luc3RhbmNlX2lkPC9uYW1lPgogICAgICAgICAgICAgICAgICAgICAgICA8dmFsdWU+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aTQ+QVBQTElDQVRJT05fSU5TVEFOQ0VfSUQ8L2k0PgogICAgICAgICAgICAgICAgICAgICAgICA8L3ZhbHVlPgogICAgICAgICAgICAgICAgICAgIDwvbWVtYmVyPgogICAgICAgICAgICAgICAgPC9zdHJ1Y3Q+CiAgICAgICAgICAgIDwvdmFsdWU+CiAgICAgICAgPC9wYXJhbT4KICAgIDwvcGFyYW1zPgo8L21ldGhvZENhbGw+Cg=='),
          match = input.match(/\d+/);
        if (!match) {
          restclient.aps.showMsg('Unable to parse \'application_instance_id\'', true);
          return;
        }
        return body.replace('APPLICATION_INSTANCE_ID', parseInt(match[0], 10));
      }
    ],
    'getSubscriptionToken': [
      'subscription_id',
      function(input) {
        var body = atob('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPG1ldGhvZENhbGw+CiAgICA8bWV0aG9kTmFtZT5wZW0uQVBTLmdldFN1YnNjcmlwdGlvblRva2VuPC9tZXRob2ROYW1lPgogICAgPHBhcmFtcz4KICAgICAgICA8cGFyYW0+CiAgICAgICAgICAgIDx2YWx1ZT4KICAgICAgICAgICAgICAgIDxzdHJ1Y3Q+CiAgICAgICAgICAgICAgICAgICAgPG1lbWJlcj4KICAgICAgICAgICAgICAgICAgICAgICAgPG5hbWU+c3Vic2NyaXB0aW9uX2lkPC9uYW1lPgogICAgICAgICAgICAgICAgICAgICAgICA8dmFsdWU+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aTQ+U1VCU0NSSVBUSU9OX0lEPC9pND4KICAgICAgICAgICAgICAgICAgICAgICAgPC92YWx1ZT4KICAgICAgICAgICAgICAgICAgICA8L21lbWJlcj4KICAgICAgICAgICAgICAgIDwvc3RydWN0PgogICAgICAgICAgICA8L3ZhbHVlPgogICAgICAgIDwvcGFyYW0+CiAgICA8L3BhcmFtcz4KPC9tZXRob2RDYWxsPgo='),
          match = input.match(/\d+/);
        if (!match) {
          restclient.aps.showMsg('Unable to parse \'subscription_id\'', true);
          return;
        }
        return body.replace('SUBSCRIPTION_ID', parseInt(match[0], 10));
      }
    ],
    'getServiceTemplateToken': [
      'service_template_id',
      function(input) {
        var body = atob('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPG1ldGhvZENhbGw+CiAgICA8bWV0aG9kTmFtZT5wZW0uQVBTLmdldFNlcnZpY2VUZW1wbGF0ZVRva2VuPC9tZXRob2ROYW1lPgogICAgPHBhcmFtcz4KICAgICAgICA8cGFyYW0+CiAgICAgICAgICAgIDx2YWx1ZT4KICAgICAgICAgICAgICAgIDxzdHJ1Y3Q+CiAgICAgICAgICAgICAgICAgICAgPG1lbWJlcj4KICAgICAgICAgICAgICAgICAgICAgICAgPG5hbWU+c2VydmljZV90ZW1wbGF0ZV9pZDwvbmFtZT4KICAgICAgICAgICAgICAgICAgICAgICAgPHZhbHVlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGk0PlNFUlZJQ0VfVEVNUExBVEVfSUQ8L2k0PgogICAgICAgICAgICAgICAgICAgICAgICA8L3ZhbHVlPgogICAgICAgICAgICAgICAgICAgIDwvbWVtYmVyPgogICAgICAgICAgICAgICAgPC9zdHJ1Y3Q+CiAgICAgICAgICAgIDwvdmFsdWU+CiAgICAgICAgPC9wYXJhbT4KICAgIDwvcGFyYW1zPgo8L21ldGhvZENhbGw+Cg=='),
          match = input.match(/\d+/);
        if (!match) {
          restclient.aps.showMsg('Unable to parse \'service_template_id\'', true);
          return;
        }
        return body.replace('SERVICE_TEMPLATE_ID', parseInt(match[0], 10));
      }
    ]
  },
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
    restclient.main.updateCurlTokenCommand();
    restclient.http.sendRequest('POST', eAPIUrl.val(), headers, 'text/xml', body, {
      onprogress: restclient.http.onprogress,
      onload: function() {
        var response = $(this.responseXML);
        if (this.status !== 200) {
          restclient.aps.showMsg('POA API says: ' + this.status + ' ' + this.statusText, true);
          if (fail)
            fail();
        } else if (response.find('name:contains("error_message")').length) {
          restclient.aps.showMsg('POA API says: ' + response.find('name:contains("error_message") + value > string').text(), true);
          if (fail)
            fail();
        } else {
          eToken.val(response.find('name:contains("aps_token") + value > string').text());
          restclient.aps.showMsg('New token acquired!');
          restclient.aps.lastFetch = moment();
          if (done)
            done();
        }
        restclient.main.updateProgressBar(-1);
      },
      onerror: function(err) {
        restclient.aps.showMsg('Unable to connect, see below...', true);
        restclient.http.onerror.call(this, err);
        if (fail)
          fail();
      }
    });
  }
};