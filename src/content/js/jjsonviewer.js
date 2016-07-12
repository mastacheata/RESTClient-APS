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
		if ($(self).parent().find('.jjson-expand-collapse-all').length === 0) {
			var collapseExpand = '<div class="jjson-expand-collapse-all"><a href="#" class="jjson-expand-all">[+] Expand all</a>&nbsp;<a href="#" class="jjson-collapse-all">[-] Collapse all</a></div>';
			$(self).parent().append(collapseExpand);
			$(self).parent().prepend(collapseExpand);
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

	function createElement(key, value, type, expanderClasses) {
		var klass = 'object',
			open = '{',
			close = '}';
		if(value === null) {
			return '<li><span class="jjson-key">"' + key + '": </span><span class="jjson-null">null</span></li>';
		}
		if(type == 'object') {
			if ($.isArray(value)) {
				klass = 'array';
				open = '[';
				close = ']';
			}

			var object = '<li><span class="'+ expanderClasses +'"></span><span class="jjson-key">"' + key + '": </span> <span class="jjson-open">' + open + '</span> <ul class="jjson-' + klass + '">';
			object = object + json2html(value, expanderClasses);
			return object + '</ul><span class="jjson-close">' + close + '</span></li>';
		}
		if(type == 'number' || type == 'boolean') {
			return '<li><span class="jjson-key">"' + key + '": </span><span class="jjson-'+ type + '">' + value + '</span></li>';
		}
		return '<li><span class="jjson-key">"' + key + '": </span><span class="jjson-'+ type + '">"' + value + '"</span></li>';
	}

	$(document).on('click', '.jjson-container .jjson-expanded', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var $self = $(this);
		if (!$self.parent().parent().hasClass('jjson-container')) {
			$self.parent().find('>ul').slideUp(100, function() {
				$self.removeClass('jjson-expanded').addClass('jjson-collapsed');
			});
		}
	});

	$(document).on('click', '.jjson-container .jjson-collapsed', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var $self = $(this);
		if (!$self.parent().parent().hasClass('jjson-container')) {
			$self.removeClass('jjson-collapsed').parent().find('>ul').slideDown(100, function() {
				$self.removeClass('jjson-collapsed').removeClass('jjson-hidden').addClass('jjson-expanded');
			});
		}
	});

	$(document).on('click', '.jjson-expand-all', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.jjson-collapsed').click();
	});
		
	$(document).on('click', '.jjson-collapse-all', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.jjson-expanded:not(.jjson-collapsed)').click();
	});

	JJsonViewer.prototype.defaults = {
		expanded: true
	};

}(window.jQuery);