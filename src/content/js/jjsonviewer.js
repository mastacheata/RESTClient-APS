/**
Copyright (c) 2016, Shridhar Deshmukh

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
**/

!function($){

	'use strict';

	$.fn.jJsonViewer = function(jjson, options) {
    return this.each( function() {
    	var self = $(this);
    	if (typeof jjson == 'string') {
  			self.data('jjson', jjson);
    	}
    	else if(typeof jjson == 'object') {
  			self.data('jjson', JSON.stringify(jjson))
    	}
    	else {
  			self.data('jjson', '');
    	}
    	new JJsonViewer(self, options);
    });
	};

	function JJsonViewer(self, options) {
		self.html('<ul class="jjson-container"></ul>');
		try {
			var json = $.parseJSON(self.data('jjson'));
			options = $.extend({}, this.defaults, options);
			var expanderClasses = getExpanderClasses(options.expanded);
			self.find('.jjson-container').append(json2html([json], expanderClasses));
		} catch(e) {
			self.prepend('<div class="jjson-error" >' + e.toString() + ' </div>');
			self.find('.jjson-container').append(self.data('jjson'));
		}
	}

	function getExpanderClasses(expanded) {
		if(!expanded) return 'jjson-expanded jjson-collapsed jjson-hidden';
		return 'jjson-expanded';
	}

	function json2html(json, expanderClasses) {
		var html = '';
		for(var key in json) {
			if (!json.hasOwnProperty(key)) {
				continue;
			}

			var value = json[key],
				type = typeof json[key];

			html = html + createElement(key, value, type, expanderClasses);
		}
		return html;
	}

	function encode(value) {
		return $('<div/>').text(value).html();
	}

	function createElement(key, value, type, expanderClasses) {
		var klass = 'jjson-object',
        	open = '{',
        	close = '}';
		if ($.isArray(value)) {
			klass = 'jjson-array';
      		open = '[';
      		close = ']';
		}
		if(value === null) {
			return '<li><span class="jjson-key">"' + encode(key) + '": </span><span class="jjson-null">null</span></li>';
		}
		if(type == 'object') {
			var object = '<li><span class="jjson-'+ expanderClasses +'"></span><span class="jjson-key">"' + encode(key) + '": </span> <span class="jjson-open">' + open + '</span> <ul class="jjson-' + klass + '">';
			object = object + json2html(value, expanderClasses);
			return object + '</ul><span class="jjson-close">' + close + '</span></li>';
		}
		if(type == 'number' || type == 'boolean') {
			return '<li><span class="jjson-key">"' + encode(key) + '": </span><span class="jjson-'+ type + '">' + encode(value) + '</span></li>';
		}
		return '<li><span class="jjson-key">"' + encode(key) + '": </span><span class="jjson-'+ type + '">"' + encode(value) + '"</span></li>';
	}

	$(document).on('click', '.jjson-container .jjson-expanded', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var $self = $(this);
		$self.parent().find('>ul').slideUp(100, function() {
			$self.addClass('jjson-collapsed');
		});
	});

	$(document).on('click', '.jjson-container .jjson-expanded.jjson-collapsed', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var $self = $(this);
		$self.removeClass('jjson-collapsed').parent().find('>ul').slideDown(100, function() {
			$self.removeClass('jjson-collapsed').removeClass('jjson-hidden');
		});
	});

	JJsonViewer.prototype.defaults = {
		expanded: true
	};

}(window.jQuery);