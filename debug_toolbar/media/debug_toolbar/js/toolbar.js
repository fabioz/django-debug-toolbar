window.djdt = (function(window, document, jQuery) {
	jQuery.cookie = function(name, value, options) { if (typeof value != 'undefined') { options = options || {}; if (value === null) { value = ''; options.expires = -1; } var expires = ''; if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) { var date; if (typeof options.expires == 'number') { date = new Date(); date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000)); } else { date = options.expires; } expires = '; expires=' + date.toUTCString(); } var path = options.path ? '; path=' + (options.path) : ''; var domain = options.domain ? '; domain=' + (options.domain) : ''; var secure = options.secure ? '; secure' : ''; document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join(''); } else { var cookieValue = null; if (document.cookie && document.cookie != '') { var cookies = document.cookie.split(';'); for (var i = 0; i < cookies.length; i++) { var cookie = $.trim(cookies[i]); if (cookie.substring(0, name.length + 1) == (name + '=')) { cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); break; } } } return cookieValue; } };
	var $ = jQuery;
	var COOKIE_NAME = 'djdt';
	var djdt = {
		jQuery: jQuery,
		events: {
			ready: []
		},
		isReady: false,
		init: function() {
			$('#djDebug').show();
			var current = null;
			$('#djDebugPanelList li a').click(function() {
				if (!this.className) {
					return false;
				}
				current = $('#djDebug #' + this.className);
				if (current.is(':visible')) {
				    $(document).trigger('close.djDebug');
					$(this).parent().removeClass('active');
				} else {
					$('.panelContent').hide(); // Hide any that are already open
					current.show();
					$('#djDebugToolbar li').removeClass('active');
					$(this).parent().addClass('active');
				}
				return false;
			});
			$('#djDebug a.djDebugClose').click(function() {
				$(document).trigger('close.djDebug');
				$('#djDebugToolbar li').removeClass('active');
				return false;
			});
			$('#djDebug a.remoteCall').click(function() {
				$('#djDebugWindow').load(this.href, {}, function() {
					$('#djDebugWindow a.djDebugBack').click(function() {
						$(this).parent().parent().hide();
						return false;
					});
				});
				$('#djDebugWindow').show();
				return false;
			});
			$('#djDebugTemplatePanel a.djTemplateShowContext').click(function() {
				djdt.toggle_arrow($(this).children('.toggleArrow'));
				djdt.toggle_content($(this).parent().next());
				return false;
			});
			$('#djDebugSQLPanel a.djSQLToggleDetails').click(function() {
				djdt.toggle_content($('.djSQLDetailsDiv', $('#sqlDetails_' + $(this).attr('data-queryid'))));
				return false;
			});
			$('#djHideToolBarButton').click(function() {
				djdt.hide_toolbar(true);
				return false;
			});
			$('#djShowToolBarButton').click(function() {
				djdt.show_toolbar();
				return false;
			});
			$(document).bind('close.djDebug', function() {
				// If a sub-panel is open, close that
				if ($('#djDebugWindow').is(':visible')) {
					$('#djDebugWindow').hide();
					return;
				}
				// If a panel is open, close that
				if ($('.panelContent').is(':visible')) {
					$('.panelContent').hide();
					return;
				}
				// Otherwise, just minimize the toolbar
				if ($('#djDebugToolbar').is(':visible')) {
					djdt.hide_toolbar(true);
					return;
				}
			});
			if ($.cookie(COOKIE_NAME)) {
				djdt.hide_toolbar(false);
			} else {
				djdt.show_toolbar(false);
			}
			$('#djDebug .djDebugHoverable').hover(function(){
				$(this).addClass('djDebugHover');
			}, function(){
			    $(this).removeClass('djDebugHover');
			});
			djdt.isReady = true;
			$.each(djdt.events.ready, function(_, callback){
			    callback(djdt);
			});
		},
		toggle_content: function(elem) {
			if (elem.is(':visible')) {
				elem.hide();
			} else {
				elem.show();
			}
		},
		close: function() {
			$(document).trigger('close.djDebug');
			return false;
		},
		hide_toolbar: function(setCookie) {
			// close any sub panels
			$('#djDebugWindow').hide();
			// close all panels
			$('.panelContent').hide();
			$('#djDebugToolbar li').removeClass('active');
			// finally close toolbar
			$('#djDebugToolbar').hide('fast');
			$('#djDebugToolbarHandle').show();
			// Unbind keydown
			$(document).unbind('keydown.djDebug');
			if (setCookie) {
				$.cookie(COOKIE_NAME, 'hide', {
					path: '/',
					expires: 10
				});
			}
		},
		show_toolbar: function(animate) {
			// Set up keybindings
			$(document).bind('keydown.djDebug', function(e) {
				if (e.keyCode == 27) {
					djdt.close();
				}
			});
			$('#djDebugToolbarHandle').hide();
			if (animate) {
				$('#djDebugToolbar').show('fast');
			} else {
				$('#djDebugToolbar').show();
			}
			$.cookie(COOKIE_NAME, null, {
				path: '/',
				expires: -1
			});
		},
		toggle_arrow: function(elem) {
			var uarr = String.fromCharCode(0x25b6);
			var darr = String.fromCharCode(0x25bc);
			elem.html(elem.html() == uarr ? darr : uarr);
		},
		ready: function(callback){
			if (djdt.isReady) {
				callback(djdt);
			} else {
				djdt.events.ready.push(callback);
			}
		}
	};
	$(document).ready(function() {
		djdt.init();
	});
	return djdt;
}(window, document, jQuery.noConflict()));