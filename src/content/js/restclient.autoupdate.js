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

"use strict";

restclient.autoupdate = {
  check: function() {
    var xhr = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest),
      ghUrl = 'https://api.github.com',
      currentVersion = restclient.getPref('version'),
      skippedVersion = restclient.getPref('skippedVersion');

    xhr.open('GET', ghUrl + '/gists/7ccf8b58f1c5e55347dd', true);
    xhr.onload = function(e) {
      e = e.target;
      var params = JSON.parse(JSON.parse(e.responseText).files.main.content);
      xhr.open('GET', ghUrl + '/repos' + params.repository + '/releases/latest', true);
      xhr.onload = function(e) {
        e = e.target;
        var release = JSON.parse(e.responseText),
          newVersion = release.tag_name.slice(1);
        if (restclient.helper.vercmp(newVersion, '> ' + currentVersion, '> ' + (skippedVersion || 0))) {
          var eMenu = $('#autoupdate-menu'),
            eInnerMenu = eMenu.children('ul'),
            eBtnMenu = eMenu.children('a');
          eMenu.toggleClass('hidden');
          document.title += ' [ Update Available ]';
          eBtnMenu.text(eBtnMenu.text() + ' [ ' + release.tag_name + ' ]');
          var currentLi = eInnerMenu.children('li.nav-header:first-child').text(release.name);
          eInnerMenu.children('li.divider').first().next().children('a').on('click', function() {
            if (confirm('[WARNING] It is recommended to always install available updates. Are you sure you want to skip this version and hide the update button?')) {
              restclient.setPref('skippedVersion', newVersion);
              eMenu.toggleClass('hidden');
            }
            return false;
          });
          currentLi = currentLi.next()
          currentLi.children('a').attr('href', release.html_url);
          release.assets.forEach(function(v) {
            currentLi = currentLi.after($('<li><a href="' + v.browser_download_url + '" target="_blank">Download: <i>' + v.name + '</i></a></li>')).next();
          });
        }
      };
      xhr.send();
    };
    xhr.send();
  }
};
