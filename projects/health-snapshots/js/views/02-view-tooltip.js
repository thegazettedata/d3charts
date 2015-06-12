// Tooltip
var TooltipView = ChartView.extend({
	tooltipEvents: function(shape, num, tooltip_html) {
		var chart = this;
		var opts = chart.options;
		var tooltip = d3.select(this.el).select('.tooltip');

		// Need the SVG done before we call the tooltip function
		shape.on("mouseover", function (d) {
			var name = d3.select(this.parentNode).datum()['name'];

			var hash = Backbone.history.getFragment();
			hash_format = hash.replace('chart-','')

			// HTML we will use
			if (hash_format === 'suicide-rates-extended') {
				var tooltip_html = 'The suicide rate ';
			} else {
				var tooltip_html = 'The rate ';
			}
			if (name !== 'State') {
				tooltip_html += ' in <strong>' + name + ' County</strong> ';
			} else {
				tooltip_html += ' for the <strong>entire state</strong> ';
			}
			tooltip_html += ' in ' + d['time'].getFullYear() + ' was ';
			tooltip_html += '<strong>' + d['value'] + '</strong>.';

			if (hash_format === 'suicide-rates-extended') {
				tooltip_html += '<br />A total of ' + d['Suicides'] + ' suicides were reported.<br />The population was ' + commaSeparateNumber(d['Population']) + ' that year.';
			}
			// Set HTML to tooltip
			$('#tooltip-' + opts['el_num']).html(tooltip_html); 
			return tooltip.style("visibility", "visible");
		})
		.on("mousemove", function () {
			// This determines if we are hovering over a dot
			// On the left or right side of the screen
			var left_right = $(window).width() / d3.event.pageX;

			if (left_right > 2) {
				var left_position = -16;
			} else {
				var left_position = $('#tooltip-' + opts['el_num']).width() + 32;
			}

			if (d3.event.pageX - left_position < 0) {
				var left = 0;
			} else {
				var left = d3.event.pageX - left_position;
			}
	    	return tooltip
				.style("top", (d3.event.pageY + 16) + "px")
				.style("left", (left) + "px");
		})
		.on("mouseout", function () {
			return tooltip.style("visibility", "hidden");
		});
	// Close events
	}
// Close view
});