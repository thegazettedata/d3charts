var BarChartView = TooltipView.extend({
	// This is called with our global CSV data
	// It creates a chart and appends to DOM
	createChart: function(column, num) {
		var chart = this;
		var opts = chart.options;
		var data = chart.data;

		// Text that will be shown
		var column_pretty = 'Ages ' + column.replace('pop_', '').replace('_', ' - ');
		if ( column_pretty.indexOf(17) > -1 ) {
			column_pretty = 'Percent of population: Ages 17 and under';
		} else if ( column_pretty.indexOf(65) > -1 ) {
			column_pretty = 'Ages 65 and older';
		}

		// Create empty SVG so we can append data to it later
		chart.svg = d3.select(chart.el).append("svg")
			.attr("width", opts.width)
			.attr("height", opts.height)

		// Map school name to school value
		opts.yScale.domain(data.map(function(d) {
			return d[ opts['column_index'] ];
		} ));

		// Create rectangles and append to DOM
		var rects = chart.svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect");

		// Set attributes
		rects.attr({
			"class": function(d, num) {
				return 'rect-bar button ' + d[ opts['column_index'] ];
			},
			"x": opts.padding[3],
			"y": function(d, num) {
				return opts.yScale( d[ opts['column_index'] ] );
			},
			"width": function(d) {
				return opts.xScale( d[column] );
			},
			"height": opts.yScale.rangeBand(),
			"fill": function(d) {
				if (d[ opts['column_index'] ] === 'Rural') {
					return '#006d2c';
				} else {
					return '#bae4b3';
				}
			}
		})

		// Append x axis
		chart.svg.append("g")
			.attr({
				"id": "axis-bar-" + num,
				"class": "x-axis-bar axis-bar",
				"transform": "translate(" + opts.padding[3] + "," + opts.padding[0] + ")"
			})
			.call(opts.xAxis);


		// Append y axis
		chart.svg.append("g")
			.attr({
				"id": "y-axis-bar-" + num,
				"class": "y-axis-bar axis-bar",
				"transform": "translate(" + opts.padding[3] + ",0)"
			})
			.call(opts.yAxis)

		chart.tooltipEvents(rects, num);

		// Stop spinner
		spinner.stop()
	// Close create charts
	},

	// This sets our options differently
	// Based on the iteration through the D3 load loop
	// Then it adds charts to DOM
	setIterationOptions: function(column, num) {
		var chart = this;
		var opts = chart.options;

		// Only show x-axis on the first 
		if (num === 0) {
			opts.height_init = opts.height;

			// Clone padding array and make it init value
			// Otherwise init value will change as the padding array does
			// In the else statement
			var padding_clone = opts.padding.slice(0);
			opts.padding_init = padding_clone;

		// Reduce height of later bars
		// To make up for x-axis present on first
		} else {
			opts.height = opts.height_init - opts.padding_init[0];
			opts.padding[0] = 0;
			opts.yScale.rangeRoundBands([
				0, opts.height - opts.padding[2]
			], 0.15);
		}

		// Draw chart to the DOM
		chart.createChart(column, num);
	},

	// Sets view options on render and window resize
	// After that, it loads D3
	setDefaultOptions: function() {
		var chart = this;
		var opts = chart.options;

		// Determines width of bars
		// Based on data values
		opts.xScale = d3.scale.linear()
			// This is the input
			// Set to max value we want to see on x-axis
			.domain( opts['xscale_domain'] )
			// This is what is outputted
			.range([
				0, opts.width - opts.padding[1] - opts.padding[3]
			]);

		// Determines height of bars
		// Based on number of values total
		opts.yScale = d3.scale.ordinal()
			// This is what is outputted
			.rangeRoundBands([
				opts.padding[0], opts.height - opts.padding[2]
			], 0.15);

		// Numbers that go left to right
		opts.xAxis = d3.svg.axis()
			.scale(opts.xScale)
			// Number of ticks we'll see from left to right
			.ticks(10)
			// Add %
			.tickFormat(function(d) {
				return d + '%';
			})
			// This makes it so the ticks go down height of the chart
			// Effectively making a grid
			.tickSize(-opts.height, 0)
			.orient("top");

		// Names on the left of the chart
		opts.yAxis = d3.svg.axis()
			.scale(opts.yScale)
			.orient("left");

		// Load data after scales have been set
		chart.loadD3();
	// Close set global vars
	}
// Close view
});