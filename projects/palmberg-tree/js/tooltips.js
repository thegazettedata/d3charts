function createTooltips() {
	var tip = d3.tip()
		.attr('class', 'd3-tip')
	  	.offset(function() {
	  		var left_location = parseInt( $(this).parent().attr('transform').match(/\((.*?),/)[1] );
		  	
		  	var mary_translate = $('svg g g:nth-child(24)').attr('transform').replace('translate(','');
			mary_translate = mary_translate.substring(0, mary_translate.indexOf(','));
			mary_translate = Math.ceil( parseInt(mary_translate) );
			
		  	if (left_location > mary_translate) {
		  		return [ 50 , -10 ]
		  	} else {
		  		return [ 50 , 10 ]
		  	}
		})
	  	.direction(function() {
	  		// We'll grab the location of Mary
	  		// So anything greater than that is farther to the right
	  		// We'll set the direction to west
	  		var left_location = $(this).parent().attr('transform').match(/\((.*?),/)[1];
		  	
		  	var mary_translate = $('svg g g:nth-child(24)').attr('transform').replace('translate(','');
			mary_translate = mary_translate.substring(0, mary_translate.indexOf(','));
			mary_translate = Math.ceil( parseInt(mary_translate) );

		  	if (left_location > mary_translate) {
		  		return 'w';
		  	} else {
		  		return 'e'
		  	}
		})
	  	.html(function(d) {
	  		ga('send', 'event', 'Mary Palmberg', 'tooltip created');
	    	
	    	var html_tip = '<span class="exit hide-desktop show-700">X</span>';
	    	html_tip += "<h3>" + d.name;
	    	if (d.age !== 'N/A') {
	    		html_tip += ", " + d.age;
	    	}
	    	if (d.town !== 'N/A') {
	    		html_tip += ", " + d.town;
	    	}
	    	html_tip += "</h3>";
			if (d.title !== 'N/A') {
				html_tip += "<h4>" + d.title + "</h4>";
			}
	    	html_tip += "<div class='tip-role'><strong>Role:</strong> " + d.role + "</div>";
	    	return html_tip;
	  	})
	svg.call(tip);

	svg.selectAll("#circle-inner")
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.on('touchstart', function(d) {
			$('.d3-tip').click(function(val, num) {
				$('.d3-tip').css('opacity',0);
			});
		});
// Close create tooltips
}