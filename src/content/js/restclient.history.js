/* ***** BEGIN LICENSE BLOCK *****
Copyright (c) 2016, Benedikt Bauer (benedikt@xenzilla.de). All rights reserved.

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

restclient.history = {
  scrollProcessing: false,
  cachedRequests: new Array(),
  callback: null,
  init: function() {
    restclient.history.updateRequests(0);
    $('#history-sidebar').show();
    var bgColor = $('body').css('background-color');
    $('#history-sidebar-inner').css('background-color', bgColor);
  },
  unload: function() {
    if (!$('#history-sidebar').is(':visible'))
      return false;
    $('#history-sidebar').hide();
  },
  initScrollbarSize: function() {
    var scrollbarHeight = $('.history-sidebar-scrollbar').outerHeight(),
      sidebarHeight = $('#history-sidebar-inner').outerHeight(),
      sidebarContentHeight = $('#history-requests').outerHeight() + $('#history-footer').outerHeight();
    var ratio = Math.floor(sidebarContentHeight / sidebarHeight);
    var sliderHeight = Math.floor(scrollbarHeight / ratio);
    var sliderTop = Math.floor($('#history-sidebar-inner').scrollTop() / ratio);
    $('.history-sidebar-scrollbar .scrollbar-slider').css('height', sliderHeight).css('top', sliderTop);
  },
  scrollWindow: function(event) {
    if (restclient.history.scrollProcessing)
      return false;
    restclient.history.scrollProcessing = true;
    if ($('#history-sidebar-inner').scrollTop() >= $('#history-requests').height() + $('#history-footer').height() - $('#history-sidebar-inner').height() - 400) {
      var num = $('#history-requests li[data-requestId]').length;
      var requestNum = parseInt($('#history-requests .requestNum').text());
      if (num < requestNum) {
        $('.loading').show();
        restclient.history.updateRequests(num);
        $('.loading').hide();
      }
    }
    restclient.history.scrollProcessing = false;
  },
  scrollToTop: function() {
    $('#history-sidebar-inner').scrollTop(0);
    return false;
  },
  clickRemoveHistory: function() {
    var requestId = $(this).parents('li').attr('data-requestId');
    var ret = restclient.sqlite.removeHistoryItem(requestId);
    if (ret === true) {
      $(this).parents('li').hide();
      var requestNum = parseInt($('#history-requests .requestNum').text());
      requestNum--;
      $('#history-requests .requestNum').text(requestNum);
    }
    return false;
  },
  updateRequests: function(offset) {
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    if (offset === 0) {
      $('.history-requests').html('');
      restclient.history.cachedRequests = new Array();
    }

    var keyword = '';
    var requestNum = restclient.sqlite.countHistory();
    $('.requestNum').text(requestNum);
    var requests = restclient.sqlite.findHistory();
    if (requests === false)
      return false;

    restclient.history.cachedRequests = restclient.history.cachedRequests.concat(requests);
    var templateHtml = $('#historyRequest').html();
    var template = $(_.template(templateHtml, {
      items: requests
    }));
    template.find('.removeHistory').on('click', restclient.history.clickRemoveHistory);
    template.find('.restore, .restoreAPS').on('click', restclient.history.applyRequest);
    $('.history-requests').append(template);
  },
  applyRequest: function() {
    var e = $(this),
      requestId = e.parents('li').attr('data-requestId'),
      request = _.where(restclient.history.cachedRequests, {
        requestId: requestId
      });
    if (request.length > 0) {
      restclient.main.applyRequest(request[0].request, e.hasClass('restoreAPS'));
      restclient.history.unload();
    }
    return false;
  }
};
