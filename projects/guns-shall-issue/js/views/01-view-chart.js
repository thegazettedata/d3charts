var project_name = 'Gun ownership in Iowa';

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

		// Load CSV data and add to view
		d3.csv(opts.csv, function(data) {
			chart.data = data;

			// Loop through every column in the data we want to chart
			// And eventually place them on the DOM
			_.each(opts.chartable_columns, function(column, num) {
				chart.setIterationOptions(column, num, state);
			});
		});

	// Close load D3
	},

	// Window resize
	resize: function() {
		var chart = this;
		var opts = chart.options;

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
			
			waitForResize(function(){
				// Reset options
				opts.width = $(window).width();

				// Used if you want to have chart be a different height
				// At a different screen size
				if ( $(window).width() > 550) {
					opts.height = opts['height-full'];
				} else {
					opts.height = opts['height-550'];
				}
				
				// Set default options and redraw
				chartview.render('refresh');
			// Wait for resize
			}, 500, "resize string");
		// Window resize
		});
	},

	initialize: function() {
	},

	// If we want to transition the chart
	// We'll set the state to refresh
	render: function(state) {
		var chart = this;
		var opts = chart.options;

		this.setDefaultOptions(state);
		this.resize();
	}
// Close chartview
});