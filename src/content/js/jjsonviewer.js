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
		if(!expanded) return 'expanded collapsed hidden';
		return 'expanded';
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
		var klass = 'object',
        	open = '{',
        	close = '}';
		if ($.isArray(value)) {
			klass = 'array';
      		open = '[';
      		close = ']';
		}
		if(value === null) {
			return '<li><span class="key">"' + encode(key) + '": </span><span class="null">null</span></li>';
		}
		if(type == 'object') {
			var object = '<li><span class="'+ expanderClasses +'"></span><span class="key">"' + encode(key) + '": </span> <span class="open">' + open + '</span> <ul class="' + klass + '">';
			object = object + json2html(value, expanderClasses);
			return object + '</ul><span class="close">' + close + '</span></li>';
		}
		if(type == 'number' || type == 'boolean') {
			return '<li><span class="key">"' + encode(key) + '": </span><span class="'+ type + '">' + encode(value) + '</span></li>';
		}
		return '<li><span class="key">"' + encode(key) + '": </span><span class="'+ type + '">"' + encode(value) + '"</span></li>';
	}

	$(document).on('click', '.jjson-container .expanded', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var $self = $(this);
		$self.parent().find('>ul').slideUp(100, function() {
			$self.addClass('collapsed');
		});
	});

	$(document).on('click', '.jjson-container .expanded.collapsed', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var $self = $(this);
		$self.removeClass('collapsed').parent().find('>ul').slideDown(100, function() {
			$self.removeClass('collapsed').removeClass('hidden');
		});
	});

	JJsonViewer.prototype.defaults = {
		expanded: true
	};

}(window.jQuery);