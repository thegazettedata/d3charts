var project_name = 'D3 template';

// Events for the body
var ChartView = Backbone.View.extend({
	el: '#svg-one-container',
	svg: [],

	// Each column in the data we want to chart
	chartable_data: ['pop_17_under','pop_18_34','pop_35_54','pop_55_64','pop_65_older'],

	// Global variables that will be set once the page loads
	width_chart: 0,
	height_chart: 0,
	padding: [],
	xScale: '',
	yScale: '',
	xAxis: '',
	yAxis: '',

	events: {
        // Google Analytics
        "mouseleave svg": "mouseLeave",
    },
    
	// Tooltip
	// Div will be appended here after view is rendered
	tooltip: '',

	// This is called with our global CSV data
	// It creates a chart and appends to DOM
	createChart: function(data, column, num) {
		// Only show x-axis on the first 
		if (num !== 0) {
			this.height_chart = 40;
			this.padding[0] = 0;
			this.yScale.rangeRoundBands([ 0, this.height_chart - this.padding[2] ], 0.15);
		}

		// Text that will be shown
		var column_pretty = 'Ages ' + column.replace('pop_', '').replace('_', ' - ')
		if ( column_pretty.indexOf(17) > -1 ) {
			column_pretty = 'Percent of population: Ages 17 and under';
		} else if ( column_pretty.indexOf(65) > -1 ) {
			column_pretty = 'Ages 65 and older';
		}

		var title = d3.select(this.el).append('h5')
			.html(column_pretty)

		// Create empty SVG so we can append data to it later
		this.svg = d3.select(this.el).append("svg")
			.attr("width", this.width_chart)
			.attr("height", this.height_chart)

		// Map school name to school value
		this.yScale.domain(data.map(function(d) {
			return d['area'];
		} ));

		// Create rectangles and append to DOM
		var rects = this.svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect");

		// Set attributes
		rects.attr({
				"class": function(d, num) {
					return d['area'];
				},
				"x": this.padding[3],
				"y": function(d, num) {
					return chartview.yScale( d['area'] );
				},
				"width": function(d) {
					return chartview.xScale( d[column] );
				},
				"height": this.yScale.rangeBand(),
				"fill": function(d) {
					if (d['area'] === 'Rural') {
						return '#006d2c';
					} else {
						return '#bae4b3';
					}
				}
			})

		// Append x axis
		this.svg.append("g")
			.attr({
				"id": "axis-" + num,
				"class": "x-axis axis",
				"transform": "translate(" + this.padding[3] + "," + this.padding[0] + ")"
			})
			.call(this.xAxis);


		// Append y axis
		this.svg.append("g")
			.attr({
				"class": "y-axis axis",
				"transform": "translate(" + this.padding[3] + ",0)"
			})
			.call(this.yAxis)

		// Need the SVG done before we call the tooltip function
		rects.on("mouseover", function (d) {
				$('#tooltip-one').html( d['area'] + ': ' + d[ chartview.chartable_data[num] ] + '%'); 

	       		return chartview.tooltip.style("visibility", "visible");
	        })
	    	.on("mousemove", function () {
	        	return chartview.tooltip
	            	.style("top", (d3.event.pageY + 16) + "px")
	            	.style("left", (d3.event.pageX + 16) + "px");
	    	})
	    	.on("mouseout", function () {
	    		return chartview.tooltip.style("visibility", "hidden");
			});

		// Stop spinner
		spinner.stop()
	// Close create charts
	},

	// Load CSV data
	loadD3: function() {
		// Load CSV data
		d3.csv("data/rural_urban.csv", function(data) {
			// Loop through every column in the data we want to chart
			// And call the create chart function with its value
			_.each(chartview.chartable_data, function(val, num) {
				chartview.createChart(data, val, num);
			});
		});
	// Close load D3
	},

	// Sets global varaibles on doc ready and window resize
	// After that, it loads D3
	setGlobalVariables: function() {
		// Chart properties
		this.width_chart = $(window).width();
		this.height_chart = 60;
		this.padding = [20, 15, 0, 55];

		// Determines width of bars
		// Based on data values
		this.xScale = d3.scale.linear()
			// This is the input
			// Set to max value we want to see on x-axis
			.domain([ 0, 30])
			// This is what is outputted
			.range([ 0, this.width_chart - this.padding[1] - this.padding[3] ]);

		// Determines height of bars
		// Based on number of values total
		this.yScale = d3.scale.ordinal()
			// This is what is outputted
			.rangeRoundBands([ this.padding[0], this.height_chart - this.padding[2] ], 0.15);

		// Numbers that go left to right
		this.xAxis = d3.svg.axis()
			.scale(this.xScale)
			// Number of ticks we'll see from left to right
			.ticks(10)
			// Add %
			.tickFormat(function(d) {
				return d + '%';
			})
			// This makes it so the ticks go down height of the chart
			// Effectively making a grid
			.tickSize(-this.height_chart, 0)
			.orient("top");

		// Names on the left of the chart
		this.yAxis = d3.svg.axis()
			.scale(this.yScale)
			.orient("left");

		// Load data
		this.loadD3();
	// Close set global vars
	},

	initialize: function() {
        this.render();
    },
    render: function() {
        $(document).ready(function() {
        	chartview.setGlobalVariables();
			chartview.tooltip = d3.select(chartview.el).select('.tooltip');
			chartview.resize();
		});
    },

    // Window resize
    resize: function() {
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
				d3.selectAll("svg").remove();
    			d3.selectAll("h5").remove();
				chartview.setGlobalVariables();
			}, 500, "resize string");
		});
    },

    mouseLeave: function() {
    	ga('send', 'event', project_name, 'Chart touched');
	}
// Close chartview
});

var chartview = new ChartView();