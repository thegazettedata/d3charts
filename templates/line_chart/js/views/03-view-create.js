var LineChartView = TooltipView.extend({
	// This is called with our global CSV data
	// It creates a chart and appends to DOM
	createChart: function(column, num) {
		var chart = this;
		var opts = chart.options;
		var data = chart.data;

		data.forEach(function(d) {
			// Pull year out of chartable column
			// Which is declared in the render file
    		d[ opts.chartable_columns[0] ] = parseYear( d[ opts.chartable_columns[0] ] );
  		});

		opts.xScale.domain(d3.extent(data, function(d) {
			return d[opts.chartable_columns];
		}));

	  	// The area under the line
	  	var svg = d3.select(chart.el).append("svg")
	  		.attr("width", opts.width)
			.attr("height", opts.height)
			.append("g")
			.attr("transform", "translate(" + opts.padding[3] + "," + opts.padding[0] + ")");
		
		var focus = svg.append("g")
			.style("display", "none");

		// X-axis
		svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + opts.height_g + ")")
			.call(opts.xAxis);

		// Y-axis
		svg.append("g")
			.attr("class", "y-axis axis")
			.call(opts.yAxis)

		// Constructs a new ordinal scale with a range of ten categorical colors
		// https://github.com/mbostock/d3/wiki/Ordinal-Scales#category10
		var color = d3.scale.category10();
		
		color.domain(d3.keys(data[0]).filter(function(key) {
			// Only return newly formatted dataset array item
			// If it's listed in the chartable_values variable
			// Which is set on chart view initialization
			if ($.inArray(key, opts.chartable_values) > -1) {
				return key !== opts.chartable_columns[0];
			}
		}));

		// Keep track of every line we noted
		// So we can draw it later
		var line = d3.svg.line()
		    // .interpolate("basis")
		    .x(function(d) {
		    	return opts.xScale( d['time'] );
		    })
		    .y(function(d) {
		    	return opts.yScale( d['value'] );
		    });

    	// Format the data correctly so it will work with the line chart
    	var dataset = color.domain().map(function(name) {
			return {
			  name: name,
			  values: data.map(function(d) {
			  	var key_one = opts.chartable_columns[0];
			  	var array = {'time': d[key_one], 'value': +d[name]};

			  	// Make sure any columns just for the tooltip is added to the data
			  	_.each(opts.tooltip_columns, function(val, num) {
			  		array[val] = d[val];
			  	});
			    return array;
			  })
			};
		});

		// Create a group, which we will add lines and circles to
		var path = svg.selectAll(".group")
      		.data(dataset)
    		.enter()
    		.append("g")
      		.attr("class", "group");
      	
      	path.append("path")
			.attr("class", "line")
			.attr("d", function(d) {
				return line( d['values'] );
			})
			.style("stroke", function(d) {
				return color( d['name'] );
			});
		
		// The circles on the line
		var circle = path.append('g')
			.selectAll('.circle')
			.data(function(d){
				return d['values']
			})
			.enter()
			.append('circle')
			.attr('class','circle')
			.attr("r", 5)
			.attr("cx", function(d) {
				return opts.xScale( d['time'] );
			})
			.attr("cy", function(d) {
				return opts.yScale( d['value'] );
			})
			.style("stroke", function(d) {
				var name = d3.select(this.parentNode).datum()['name'];
				return color(name);
			});

		chart.tooltipEvents(circle, num);

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
	    	.range([ 20, opts.width_g ]);

	    opts.yScale = d3.scale.linear()
	    	.domain(opts.yscale_domain)
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
				return d;
			})
	    	.orient("left");

		// Load data after scales have been set
		chart.loadD3();
	// Close set global vars
	}
// Close view
});