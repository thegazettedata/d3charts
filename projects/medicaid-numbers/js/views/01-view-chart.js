var project_name = 'Medicaid by the numbers';

// Events for the body
var ChartView = Backbone.View.extend({
	// Global variables that will be set once the page loads
	constructor: function(options) {
		// Default options, which will be set on view extend
		this.default_options = {
			width: $(window).width(),
			height: 0,
			padding: [],
			xScale: '',
			yScale: '',
			xAxis: '',
			yAxis: ''
		},
		// This allows us to access these options
		// Throughout the views
		this.options = $.extend(true, this.default_options, options);
		Backbone.View.apply(this, arguments);
	},

	events: {
		// Google Analytics
		"mouseleave svg": "mouseLeave",
	},

	mouseLeave: function() {
		ga('send', 'event', project_name, 'Chart touched');
	},

	// Load CSV data
	loadD3: function(state) {
		var chart = this;
		var opts = chart.options;

		// Loop through every column in the data we want to chart
		// And eventually place them on the DOM
		_.each(opts.chartable_columns, function(column, num) {
			chart.setIterationOptions(column, num, state);
		});

	// Close load D3
	},

	// Window resize
	resize: function() {
		var chart = this;
		var opts = chart.options;
		var original_window_width = $(window).width();

		// Wait to call the resize function
		// After resize is completed
		var waitForResize = (function () {
			var timers = {};
			return function (callback, ms, uniqueId) {
				if (!uniqueId) {
					uniqueId = "Don't call this twice without a uniqueId";
		    	}
		    	if (timers[uniqueId]) {
		    		clearTimeout (timers[uniqueId]);
		    	}
		    	timers[uniqueId] = setTimeout(callback, ms);
		  	};
		})();

		$(window).resize(function() {
    	var new_window_width = $(window).width();

    	if (new_window_width != original_window_width) {
    		waitForResize(function(){
					// Set default options and resize
					_.each(chartviews, function(val, num) {
						$(val['el']).css('visibility', 'hidden');

						setTimeout(function(){
							val['options']['width'] = $(val['el']).width();
							val.render('refresh');
						}, 1000);
					});
					
				// Close wait for resize
				}, 500, "resize string");
			// Close if
			}
		// Close window resize
		});

		pymChild.sendHeight();
	// Close resize
	},

	initialize: function() {
	},

	render: function(state) {
		this.setDefaultOptions(state);
		
		// Only run resize event once
		if (this['cid'] == 'view3' && state != 'refresh') {
			this.resize();
		}
	}
// Close chartview
});