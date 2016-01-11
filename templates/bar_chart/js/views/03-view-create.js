var BarChartView = TooltipView.extend({
	// This is called with our global CSV data
	// It creates a chart and appends to DOM
	createChart: function(column, num, state) {
		var chart = this;
		var opts = chart.options;
		var data = chart.data;

		// Create empty SVG so we can append data to it later
		if (state !== 'refresh') {
			svg = d3.select(chart.el).append("svg")
		} else {
			svg = d3.select("svg")
		}

		svg.attr("width", opts.width)
			.attr("height", opts.height)


		// Map letter to individual bar
		opts.xScale.domain(data.map(function(d) {
			return d[ opts['column_index'] ];
		} ));

		// Create domain of zero to max value in frequency column
		opts.yScale.domain([0, d3.max(data, function(d) {
			return d[column];
		} )])

		// Create horizontal grid
		var grid = svg.selectAll("line.grid")
			.data( opts.yScale.ticks(10) )

		if (state !== 'refresh') {
			grid.enter()
				.append("line")
				.attr({
					"class":"grid",
					"fill" : "none",
					"shape-rendering" : "crispEdges",
					"stroke" : "black",
					"stroke-width" : "1px"
				});
		}

		grid.attr({
			"x1" : opts.padding[3],
			"x2" : opts.width,
			"y1" : function(d){
				return opts.yScale(d);
			},
			"y2" : function(d){
				return opts.yScale(d);
			}
		});

			// Create rectangles and append to DOM
		var rects = svg.selectAll("rect")
			.data(data)

		if (state !== 'refresh') {
			rects.enter()
				.append("rect")
				.attr({
					"class": function(d, num) {
						return 'rect-bar button'
					},
					"fill": function(d) {
						return 'lightblue';
					}
				})
		} else {
			rects.transition()
				.duration(750)
		}

		// Set attributes
		rects.attr({
			"x": function(d) {
				return opts.xScale( d[ opts['column_index'] ] );
			},
			"y": function(d, num) { 
				return opts.yScale( d[column] );
			},
			"width": opts.xScale.rangeBand(),
			"height": function(d, num) {
				return opts.height - opts.padding[2] - opts.yScale( d[column] );
			}
		})

		// Append x axis
		if (state !== 'refresh') {
			svg.append("g")
				.attr({
					"id": "axis-bar-" + num,
					"class": "x-axis-bar axis-bar"
				})
		}

		var x_axis = d3.select(".x-axis-bar")
			.attr({
				"transform": "translate(" + 10 + "," + (opts.height - 20) + ")"
			})
			.call(opts.xAxis)
			

		if (state != 'refresh') {
			x_axis.append("line")
				.attr({
					"class": "x-axis-bottom-line",
					"y2": 0
				});
		}

		 d3.select(".x-axis-bottom-line")
		 	.attr({
		 		"x1": opts.padding[3],
		 		"x2": opts.width
		 	})


		// Append y axis
		if (state !== 'refresh') {
			svg.append("g")
				.attr({
					"id": "y-axis-bar-" + num,
					"class": "y-axis-bar axis-bar"
				})
		}

		d3.select(".y-axis-bar")
			.attr({
				"transform": "translate(" + opts.padding[3] + ",0)"
			})
			.call(opts.yAxis);

		// Create tooltip
		chart.tooltipEvents(rects, num);

		// Stop spinner
		spinner.stop()

		// This is calling an updated height.
    if (pymChild) {
        pymChild.sendHeight();
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
			// opts.yScale.rangeRoundBands([
			// 	0, opts.height - opts.padding[2]
			// ], 0.15);
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
		// Based on number of values total
		opts.xScale = d3.scale.ordinal()
			// This is what is outputted
			.rangeRoundBands([
				opts.padding[3], opts.width - opts.padding[1]
			], 0.1);

		// Determines height of bars
		// Based on data values
		opts.yScale = d3.scale.linear()
			// This is the input
			// Set to max value we want to see on x-axis
			// This is what is outputted
			.range([
				opts.height - opts.padding[2], 0
			]);

		// Numbers that go left to right
		opts.xAxis = d3.svg.axis()
			.scale(opts.xScale)
			.orient("bottom");

		// Names on the left of the chart
		opts.yAxis = d3.svg.axis()
			.scale(opts.yScale)
			// Number of ticks we'll see from left to right
			.ticks(5)
			// Add %
			.tickFormat(function(d) {
				return d;
			})
			// This makes it so the ticks go down height of the chart
			// Effectively making a grid
			.tickSize(-opts.height, 0)
			.orient("left");

		// Load data after scales have been set
		chart.loadD3(state);
	// Close set global vars
	}
// Close view
});