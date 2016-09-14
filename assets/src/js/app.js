//= include ../../../bower_components/foundation/js/foundation.js
//= include ../../../bower_components/jquery.fitvids/jquery.fitvids.js

jQuery ( function($) {

	var site = new SiteController($);
	site.init();

});

function SiteController($)
{
	self.init = function()
	{
		initFoundation();
	}

	function initFoundation() {
		$(document).foundation();
	}

	return self;
}
