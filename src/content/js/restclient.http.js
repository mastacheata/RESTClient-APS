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

"use strict";

restclient.http = {
  mimeType : false,
  methods: ['GET','POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'],
  sendRequest: function(requestMethod, requestUrl, requestHeaders, mimeType, requestBody, callbacks) {
    try{
      restclient.main.updateProgressBar(100);      
      restclient.http.mimeType = mimeType;
      restclient.http.url = requestUrl;
      //restclient.log(requestMethod);
      var xhr = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
      xhr.onerror = callbacks ? callbacks.onerror : restclient.http.onerror;
      xhr.onload = callbacks ? callbacks.onload : restclient.http.onload;
      xhr.onprogress = callbacks ? callbacks.onprogress : restclient.http.onprogress;
      
      xhr.open(requestMethod, requestUrl, true);
      xhr.setRequestHeader("Accept-Language", null);

      for(var i=0, header; header = requestHeaders[i]; i++) {
        xhr.setRequestHeader(header[0], header[1]);
        
        //Override XMLHTTPRequest default charset
        if(typeof mimeType != 'string' && header[0].toLowerCase() == 'content-type' && header[1].toLowerCase().indexOf('charset') > -1)
        {
          xhr.overrideMimeType(header[1]);
        }
      }

      if(typeof mimeType == 'string')
        xhr.overrideMimeType(mimeType);

      restclient.http.xhr = xhr;
      if(restclient.getPref('requestTimer', false) === true)
        restclient.http.startTime = new Date().getTime();
      else
        restclient.http.startTime = false;
      xhr.send(requestBody);
    } catch (e) {
      restclient.main.setResponseHeader(["Error: Could not connect to server...", e.message, '', 'Firefox was unable to open this URL: '+restclient.http.url, 'Navigate to it in a browser tab and fix any errors before re-issuing the request!'], false);
      restclient.main.updateProgressBar(-1);
    }
  },
  onprogress: function(evt) {
    restclient.main.updateProgressBar(evt.loaded * 100 / evt.total, 'Receving data...');
    if(evt.loaded == evt.total)
      restclient.main.updateProgressBar(-1, 'Sending data...');
  },
  onerror: function(err) {
    var tcpErr = restclient.http.getTCPError(this),
      errData = ["Error: Could not connect to server...", tcpErr.type + ': ' + tcpErr.name, '', 'Firefox was unable to open this URL: '+restclient.http.url, 'Navigate to it in a browser tab and fix any errors before re-issuing the request!'];
    restclient.main.clearResult();
    restclient.main.updateProgressBar(-1);
    restclient.main.showResponse();
    restclient.main.setResponseHeader(errData, false);
  },
  onload: function(xhr) {
    if(restclient.http.startTime)
    {
      var requestTime = (new Date().getTime()) - restclient.http.startTime;
      restclient.main.showStatus('Execution Time : ' + requestTime + 'ms')
    }
    restclient.main.clearResult();
    xhr = xhr.target;
    var headers = {};
    headers["Status Code"] = xhr.status + " " + xhr.statusText;

    var headersText     = xhr.getAllResponseHeaders(),
        responseHeaders = headersText.split("\n"),
        key, value;

    for (var i = 0, header; header = responseHeaders[i]; i++) {
      if(header.indexOf(":") > 0) {
        key   = header.substring(0, header.indexOf(":"));
        value = xhr.getResponseHeader(key);
        if(value)
          headers[key] = value;
      }
    }
    headers["Status Code"] = xhr.status + " " + xhr.statusText;
    restclient.main.setResponseHeader(headers);
    var contentType = xhr.getResponseHeader("Content-Type"),
      displayHandler = 'display';
    if(contentType && contentType != '') {
      if(contentType.indexOf('html') >= 0) {
        displayHandler = 'displayHtml';
      }
      if(contentType.indexOf('xml') >= 0) {
        displayHandler = 'displayXml';
      }
      if(contentType.indexOf('json') >= 0) {
        displayHandler = 'displayJson';
      }
      if(contentType.indexOf('image') >= 0) {
        if(restclient.http.mimeType === false)
          displayHandler = 'displayImageRaw';
        else
          displayHandler = 'displayImage';
      }
    }
    
    // handle a zero length body
    if(xhr.responseText.length == 0) {
      displayHandler = 'displayImageRaw';
    }    
    restclient.main.checkMimeType.apply(restclient.http, []);
    restclient.main[displayHandler].apply(restclient.http, []);
    restclient.main.updateProgressBar(-1);
    restclient.main.showResponse();
  },
  abortRequest: function(){
    if(!restclient.http.xhr)
      return false;
    restclient.http.xhr.abort();
    restclient.main.clearResult();
    restclient.main.updateProgressBar(-1);
  },
  getTCPError: function(xhr) {
    const Cc = Components.classes,
      Ci = Components.interfaces;
    var status = xhr.channel.QueryInterface(Ci.nsIRequest).status,
      errType,
      errName;
    if ((status & 0xff0000) === 0x5a0000) { // Security module
      const nsINSSErrorsService = Ci.nsINSSErrorsService;
      var nssErrorsService = Cc['@mozilla.org/nss_errors_service;1'].getService(nsINSSErrorsService),
        errorClass;
      try {
        errorClass = nssErrorsService.getErrorClass(status);
      } catch (ex) {
        errorClass = 'SecurityProtocol';
      }
  
      if (errorClass == nsINSSErrorsService.ERROR_CLASS_BAD_CERT) {
        errType = 'SecurityCertificate';
      } else {
        errType = 'SecurityProtocol';
      }
      if ((status & 0xffff) < Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE)) {
        var nssErr = Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE) - (status & 0xffff);
  
        switch (nssErr) {
          case 11: // SEC_ERROR_EXPIRED_CERTIFICATE, sec(11)
            errName = 'SecurityExpiredCertificateError';
            break;
          case 12: // SEC_ERROR_REVOKED_CERTIFICATE, sec(12)
            errName = 'SecurityRevokedCertificateError';
            break;
          case 13: // SEC_ERROR_UNKNOWN_ISSUER, sec(13)
          case 20: // SEC_ERROR_UNTRUSTED_ISSUER, sec(20)
          case 21: // SEC_ERROR_UNTRUSTED_CERT, sec(21)
          case 36: // SEC_ERROR_CA_CERT_INVALID, sec(36)
            errName = 'SecurityUntrustedCertificateIssuerError';
            break;
          case 90: // SEC_ERROR_INADEQUATE_KEY_USAGE, sec(90)
            errName = 'SecurityInadequateKeyUsageError';
            break;
          case 176: // SEC_ERROR_CERT_SIGNATURE_ALGORITHM_DISABLED, sec(176)
            errName = 'SecurityCertificateSignatureAlgorithmDisabledError';
            break;
          default:
            errName = 'SecurityError';
            break;
        }
      } else {
        var sslErr = Math.abs(nsINSSErrorsService.NSS_SSL_ERROR_BASE) - (status & 0xffff);
  
        switch (sslErr) {
          case 3: // SSL_ERROR_NO_CERTIFICATE, ssl(3)
            errName = 'SecurityNoCertificateError';
            break;
          case 4: // SSL_ERROR_BAD_CERTIFICATE, ssl(4)
            errName = 'SecurityBadCertificateError';
            break;
          case 8: // SSL_ERROR_UNSUPPORTED_CERTIFICATE_TYPE, ssl(8)
            errName = 'SecurityUnsupportedCertificateTypeError';
            break;
          case 9: // SSL_ERROR_UNSUPPORTED_VERSION, ssl(9)
            errName = 'SecurityUnsupportedTLSVersionError';
            break;
          case 12: // SSL_ERROR_BAD_CERT_DOMAIN, ssl(12)
            errName = 'SecurityCertificateDomainMismatchError';
            break;
          default:
            errName = 'SecurityError';
            break;
        }
      }
    } else {
      errType = 'Network';
      switch (status) {
        case 0x804B000C: // NS_ERROR_CONNECTION_REFUSED, network(13)
          errName = 'ConnectionRefusedError';
          break;
          // network timeout error
        case 0x804B000E: // NS_ERROR_NET_TIMEOUT, network(14)
          errName = 'NetworkTimeoutError';
          break;
          // hostname lookup failed
        case 0x804B001E: // NS_ERROR_UNKNOWN_HOST, network(30)
          errName = 'DomainNotFoundError';
          break;
        case 0x804B0047: // NS_ERROR_NET_INTERRUPT, network(71)
          errName = 'NetworkInterruptError';
          break;
        default:
          errName = 'NetworkError';
          break;
      }
    }
    return {
      name: errName,
      type: errType
    };
  }
}
