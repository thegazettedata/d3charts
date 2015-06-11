var project_name = 'D3 template';

var parseDate = d3.time.format("%d-%b-%y").parse;
var parseYear = d3.time.format("%Y").parse;

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
	loadD3: function() {
		var chart = this;
		var opts = chart.options;

		// Load CSV data and add to view
		d3.csv(opts.csv, function(data) {
			chart.data = data;

			// Loop through every column in the data we want to chart
			// And eventually place them on the DOM
			_.each(opts.chartable_columns, function(column, num) {
				chart.setIterationOptions(column, num);
			});
		});

	// Close load D3
	},

	// Called on window resize and hash changes
	resetChart: function(state) {
		var chart = this;
		var opts = chart.options;

		// Reset options
    	opts.width = $(window).width();
    	opts.height = opts.height_init;
    	opts.padding = opts.padding_init;
    			
		// Remove items on DOM, set options
		// And redraw charts
		d3.selectAll("svg").remove();
    	d3.selectAll("h5").remove();
		
		// Set default options and redraw
		chart.setDefaultOptions();
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
    			// Reset options and redraw chart
    			chart.resetChart('resize');
			}, 500, "resize string");
		});
    },

	initialize: function() {
	},
    render: function() {
    	var chart = this;
    	var opts = chart.options;

    	this.setDefaultOptions();
    	this.resize();
    }
// Close chartview
});