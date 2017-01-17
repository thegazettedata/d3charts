// Tooltip
var TooltipView = ChartView.extend({
	tooltipEvents: function(shape, num, tooltip_html) {
		var chart = this;
		var opts = chart.options;
		var tooltip = d3.select(this.el).select('.tooltip');

		// Need the SVG done before we call the tooltip function
		shape.on("mouseover", function (d) {
			if (opts['chart_type'] == 'bar') {
				var tooltip_html = 'Enrollment: ';
				tooltip_html += commaNumbers( d[ opts.chartable_columns[num] ] );
			} else {
				var year = 'SFY' + String( d['time'].getFullYear() ).replace('20','');
				var month = d['time'].getMonth() + 1;
				var hide_tick = false;

				if (month == 1) {
					var quarter = 'Q1'
				} else if (month == 4) {
					var quarter = 'Q2'
				} else if (month == 7) {
					var quarter = 'Q3'
				} else if (month == 10) {
					var quarter = 'Q4'
				}

				var tooltip_html = quarter + ' ' + year + ': ';

				if (opts['tick_format'] == 'percent') {
					tooltip_html += commaNumbers( d['value'] ) + '%';
				} else {
					tooltip_html += '$' + commaNumbers( d['value'] );
				}
			}

			$('#tooltip-' + opts['el_num'] ).html(tooltip_html);
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

			// Put tooltip on left or right
			// Depending on where the mouse interaction is
			if (left_right > 2) {
				var left_position = -16;
			} else {
				var left_position = $('#tooltip-' + opts['el_num']).width() + 32;
			}

			// Make sure the tooltip doesn't appear off screen
			if (d3.event.pageX - left_position < 0) {
				var left = 0;
			} else {
				var left = d3.event.pageX - left_position;
			}

			// Style tooltip
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