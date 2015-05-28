var LineChartView = TooltipView.extend({
	// This is called with our global CSV data
	// It creates a chart and appends to DOM
	createChart: function(column, num) {
		var chart = this;
		var opts = chart.options;
		var data = chart.data;

		data.forEach(function(d) {
    		d['year'] = parseDate( d['year'] );
    		d['medicaid_percent'] = +d['medicaid_percent'];
  		});

		opts.xScale.domain(d3.extent(data, function(d) {
			return d['year'];
		}));

	  	// The area under the line
	  	var svg = d3.select(chart.el).append("svg")
	  		.attr("width", opts.width)
			.attr("height", opts.height)
			.append("g")
			.attr("transform", "translate(" + opts.padding[3] + "," + opts.padding[0] + ")");
		
		var focus = svg.append("g")
			.style("display", "none");

	  	svg.append("path")
	      .datum(data)
	      .attr("class", "area")
	      .attr("d", opts.area);

      	// The line
      	svg.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", opts.line);

		// X-axis
		svg.append("g")
			.attr("class", "x-axis-two axis-two")
			.attr("transform", "translate(0," + opts.height_g + ")")
			.call(opts.xAxis);

		// Y-axis
		svg.append("g")
			.attr("class", "y-axis-two axis-two")
			.call(opts.yAxis)

		// Draw the dots on the line chart
		var circles = svg.selectAll("circle")
			.data(data)											
			.enter()
			.append("circle")								
				.attr("r", 3)
				.attr("cx", function(d) {
					return opts.xScale( d['year'] );
				})
				.attr("cy", function(d) {
					return opts.yScale( d['medicaid_percent'] );
				})

		chart.tooltipEvents(circles, num);

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

		if (num === 0) {
			opts.height_init = opts.height;

			// Clone padding array and make it init value
			// Otherwise init value will change as the padding array does
			// In the else statement
			var padding_clone = opts.padding.slice(0);
			opts.padding_init = padding_clone;
		}

		// Draw chart to the DOM
		chart.createChart(column, num);
	},

	// Sets view options on render and window resize
	// After that, it loads D3
	setDefaultOptions: function() {
		var chart = this;
		var opts = chart.options;

		// This sets height of the g element
		// Where the chart is actually place
		// This makes room for x-axis labels
		opts.height_g = opts.height - opts.padding[0] -  opts.padding[2];
		opts.width_g = opts.width - opts.padding[1] - opts.padding[3];

		opts.xScale = d3.time.scale()
	    	.range([ 0, opts.width_g ]);

	    opts.yScale = d3.scale.linear()
	    	.domain([0, 20])
	    	.range([ opts.height_g, 0 ]);

	    opts.xAxis = d3.svg.axis()
	    	.scale(opts.xScale)
	    	.tickSize(-opts.height_g, 0)
	    	.orient("bottom");

		opts.yAxis = d3.svg.axis()
	    	.scale(opts.yScale)
	    	.ticks(5)
	    	.tickSize(-opts.width_g, 0)
	    	.tickFormat(function(d) {
				return d + '%';
			})
	    	.orient("left");

		opts.line = d3.svg.line()
			.x(function(d) {
				return opts.xScale( d['year'] );
			})
			.y(function(d) {
				return opts.yScale( d['medicaid_percent'] );
			})

		opts.area = d3.svg.area()
			.x(function(d) {
				return opts.xScale( d['year'] );
			})
			.y0(opts.height_g)
			.y1(function(d) {
				return opts.yScale( d['medicaid_percent'] );
			});

		// Load data after scales have been set
		chart.loadD3();
	// Close set global vars
	}
// Close view
});