( function($) {
	
	/* Supported properties */
	var properties = [];
	properties['summary'] = 'summary';
	properties['description'] = 'description';
	properties['url'] = 'url';
	properties['photo'] = 'photo';
	properties['street-address'] = 'street-address';
	properties['postal-code'] = 'postal-code';
	properties['locality'] = 'locality';
	properties['region'] = 'region';
	properties['latitude'] = 'latitude';
	properties['longitude'] = 'longitude';
	properties['startDate'] = 'startDate';
	properties['dtstart'] = 'dtstart';	
	properties['endDate'] = 'endDate';
	properties['dtend'] = 'dtend';
	properties['duration'] = 'duration';
	properties['eventType'] = 'eventType';
	properties['category'] = 'category';
	properties['fn'] = 'fn';
	properties['name'] = 'name';
	properties['nickname'] = 'nickname';	
	properties['title'] = 'title';
	properties['role'] = 'role';
	properties['org'] = 'org';
	properties['tel'] = 'tel';
	properties['reviewer'] = 'reviewer';
	properties['dtreviewed'] = 'dtreviewed';
	properties['rating'] = 'rating';
	
	jQuery.fn.extend({
		items: getItems
	});
	
	function getItems(type, ns, callback) {
		var selector = jQuery.map(splitTokens(ns), function(t) {
			return '['+type+'~="'+t.replace(/"/g, '\\"')+'"]';
		}).join(',') || '*';
		return jQuery(selector, this).filter(callback);
	}
	
	function splitTokens(s) {
		if (s && /\S/.test(s))
		  return s.replace(/^\s+|\s+$/g,'').split(/\s+/);
		return [];
	}
	
	function resolve(url) {
		if (!url)
			return '';
		var img = document.createElement('img');
		img.setAttribute('src', url);
		return img.src;
	}
	
	function populateItem(elm, list, prefix, property) {
		
		var tagName = elm.tagName.toUpperCase();
		list.tagName = tagName;
		list.src = null;
		list.href = null;
		switch ( tagName ) {
			case 'AUDIO':
			case 'EMBED':
			case 'IFRAME':
			case 'IMG':
			case 'SOURCE':
			case 'VIDEO':
				list.src = resolve(elm.getAttribute('src'));
			case 'A':
			case 'AREA':
			case 'LINK':
				list.href = elm.getAttribute('href');
		}
		list.content = null;
		if (elm.getAttribute('content')) {
			list.content = elm.getAttribute('content');
		} else if (elm.innerHTML) {
			list.content = elm.innerHTML;
		}
		list.rel = elm.getAttribute('rel');

	}
	
	function getItem(node, list) {
		node.children().each( function() {
			var property = $(this).attr('property');
			if ( property ) {
				if ( !list[property] ) {
					list[property] = {};
				}
				populateItem(this, list[property], property);
			}
			getItem($(this), list);
		});
		return list;
	}
	
	$.extend($.ui.gmap.prototype, {
		
		/**
		 * Extracts meta data from the HTML
		 * @param type:String - rdfa, microformats or microdata 
		 * @param ns:String - the namespace
		 * @param callback:function(item:jQuery, result:Array<String>)
		 */
		loadMetadata: function(type, ns, callback) { 
			
			var prefix;
			if ( ns.indexOf('http') > -1 ) {
				prefix = ns.substring(ns.lastIndexOf('/')+1,ns.length);
				prefix = prefix.replace('?','');
				prefix = prefix.replace('#','');
			} else if ( ns.indexOf(':') > -1 ) {
				prefix = ns.split(':')[1];
			} else {
				prefix = ns;
			}
			prefix = prefix.toLowerCase();
			var retval = [];
			retval[prefix] = [];

			if ( type === 'rdfa' ) {
				jQuery(document).items('typeof', ns, function() { return (this.getAttribute('typeof') != null); }).each(function(i, node) {
					getItem($(node), retval[prefix]);
					$.ui.gmap._trigger(callback, retval, i);
				});
			} else if ( type === 'microformat') {
				$('.'+ns).each(function(i, node) {
					$.ui.gmap._trigger(callback, i, $(node), getMicroformatItem($(node), []));
				});
			} else if ( type === 'microdata') {
				jQuery(document).items('itemtype', ns, function() { return (this.getAttribute('itemscope') != null && this.getAttribute('itemprop') == null); } ).each(function(i, node) {

					//$.ui.gmap._trigger(callback, i, $(node), getMicroformatItem($(node), []));
					
				});
			}
		}
	
	});
	
} (jQuery) );