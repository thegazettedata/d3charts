var BarChartView = TooltipView.extend({
	// This is called with our global CSV data
	// It creates a chart and appends to DOM
	createChart: function(column, num, state) {
		var chart = this;
		var opts = chart.options;
		var data = opts.data;

		// Create empty SVG so we can append data to it later
		if (state !== 'refresh') {
			svg = d3.select(chart.el).append("svg")
			
		} else {
			var id = $(chart['el']).attr('id');
			svg = d3.select("#" + id + " svg")
		}

		svg.attr("width", opts.width)
			.attr("height", opts.height)

		// Map school name to school value
		opts.yScale.domain(data.map(function(d) {
			return d[ opts['column_index'] ];
		} ));

		// Create rectangles and append to DOM
		var rects = svg.selectAll("rect")
			.data(data)

		if (state !== 'refresh') {
			rects.enter()
				.append("rect");
		}

		// Set attributes
		if (state !== 'refresh') {
			bars = rects.attr({
				"class": function(d, num) {
					return 'rect-bar button ' + d[ opts['column_index'] ];
				},
				"fill": function(d) {
					if (String(d['mco']) == 'undefined') {
						return '#a65628';
					} else {
						if (d['mco'] == 'Amerigroup') {
							return 'rgb(152, 78, 163)';
						} else if (d['mco'] == 'AmeriHealth') {
							return 'rgb(55, 126, 184)';
						} else if (d['mco'] == 'UnitedHealthcare') {
							return 'rgb(255, 127, 0)';

						}
					}
				}
			})
		} else {
			bars = d3.selectAll('#' + id + ' .rect-bar')
		}

		bars.attr({
			"x": opts.padding[3],
			"y": function(d, num) {
				return opts.yScale( d[ opts['column_index'] ] );
			},
			"width": function(d) {
				if (state !== 'refresh') {
					return 0;
				} else {
					return opts.xScale( d[column] );
				}
			},
			"height": opts.yScale.rangeBand()
		})

		if (state !== 'refresh') {
			bars.transition()
				.duration(750)
				.delay(function (d, i) {
					return i * 50;
				})
				.attr({
					"width": function(d) {
						return opts.xScale( d[column] );
					},
				})
		}

		// Append x axis
		if (state !== 'refresh') {
			x_axis = svg.append("g")
				.attr({
					"id": "axis-bar-" + num,
					"class": "x-axis-bar axis-bar"
				})

			y_axis = svg.append("g")
				.attr({
					"id": "y-axis-bar-" + num,
					"class": "y-axis-bar axis-bar"
				})
		} else {
			x_axis = d3.select('#' + id + ' x-axis-bar')
			y_axis = d3.select('#' + id + ' y-axis-bar')
		}

		// Position or re-position the axises
		x_axis.attr({
			"transform": "translate(" + opts.padding[3] + "," + opts.padding[0] + ")"
		})
		.call(opts.xAxis)
		
		y_axis.attr({
			"transform": "translate(" + opts.padding[3] + ",0)"
		})
		.call(opts.yAxis)

		if (state !== 'refresh') {
			// Create tooltip
			chart.tooltipEvents(rects, num);
		}

		// This is calling an updated height.
    if (pymChild) {
        pymChild.sendHeight();
    }

    if (state !== 'refresh') {
			// Stop spinner
			spinner.stop();
		} else {
			$(opts['el']).css('visibility', 'visible');
		}

	// Close create charts
	},

	// This sets our options differently
	// Based on the iteration through the D3 load loop
	// Then it adds charts to DOM
	setIterationOptions: function(column, num, state) {
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
		chart.createChart(column, num, state);
	},

	// Sets view options on render and window resize
	// After that, it loads D3
	setDefaultOptions: function(state) {
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
			.ticks(3)
			// Add %
			.tickFormat(function(d) {
				return d3.format("s")(d);
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
		chart.loadD3(state);
	// Close set global vars
	}
// Close view
});