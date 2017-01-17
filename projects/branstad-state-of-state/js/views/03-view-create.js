var LineChartView = TooltipView.extend({
	// This is called with our global CSV data
	// It creates a chart and appends to DOM
	createChart: function(column, num, state) {
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

		// SVG
		if (state !== 'refresh') {
			var svg = d3.select(chart.el).append("svg")
		} else {
			var svg = d3.select(chart.el).select('svg')
		}

		// SVG
		svg.attr("width", opts.width)
			.attr("height", opts.height)

		if (state !== 'refresh') {
			svg = svg.append("g")
				.attr("class","main-g")
				.attr("transform", "translate(" + opts.padding[3] + "," + opts.padding[0] + ")");

			// Create x and y axises
			x_axis = svg.append("g")
				.attr("class", "x-axis axis")
			y_axis = svg.append("g")
				.attr("class", "y-axis axis")
		} else {
			// Select x and y axises
			x_axis = svg.select('.x-axis')
			y_axis = svg.select('.y-axis')
		}

		// Place or move x-axis
		x_axis.attr("transform", "translate(0," + opts.height_g + ")")
			.call(opts.xAxis);

		// Place or move y-axis
		y_axis.call(opts.yAxis)

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
		  .interpolate("step-before")
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
		//  Close dataset
		});

		// Define path and add data
		svg = svg.append('g')
			.attr("class", "group-container");

		var path = svg.selectAll(".group")
			.data(dataset)

		// Create a group, which we will add lines and circles to
		// Create new path if we're not refreshing
		if (state !== 'refresh') {
			path.enter()
				.append("g")
				.attr("id", function(d) {
					return "group-" + d['name']
				})
				.attr('class','group')
				.attr("opacity", function(d) {
					if (d['name'] == 'Iowa') {
						return 1;
					} else {
						return 0;
					}
				})
	      	
			path.append("path")
				.attr("class", "line")
				.style("stroke", function(d) {
					return color( d['name'] );
				})
				.style("stroke-width", function(d) {
					if (d['name'] == 'Iowa') {
						return '8px';
					} else {
						return '2px';
					}
				})

			path.append('text')
				.attr("x","30")
				.attr('y', function(d) {
					return opts.yScale(d['values'][4]['value']) - 5;
				})
				.attr('class', 'word-count-annotation')
				.append('tspan')
				.html(function(d) {
					if (d['name'] == 'i') {
						d['name'] = 'I'
					}

					if (d['name'] == 'Iowa') {
						var btn = '<btn class="selected">'
					} else {
						var btn = '<btn>'
					}
					btn += d['name'].replace('iowa','Iowa');
					btn += '</btn>'

					$('#btn-container').append(btn);

					return d['name'];
				})

			// The circles on the line
			var circle = path.append('g')
			.attr("class", "circles")

			path = path.select('path')
		// If refresh just select
		} else {
			var circle = svg.selectAll('.group')

			path = svg.selectAll('.line')
				.data(dataset)
		}

		// Add or re-add data to circles
		circle = circle.selectAll('.circle')
			.data(function(d){
				return d['values']
			})

		// If not refresh
		// Add data to circle
		if (state !== 'refresh') {
			circle.enter()
				.append('circle')
				.attr('class','circle')
				.attr("r", 8)
				.style("stroke", function(d) {
					var name = d3.select(this.parentNode).datum()['name'];
					return color(name);
				})
		}
			
		// Draw or re-draw lines
		path.transition()
			.duration(750)
			.attr("d", function(d) {
				return line( d['values'] );
			})

		// Position or re-position circles
		circle.transition()
			.duration(750)
			.attr("cx", function(d) {
				return opts.xScale( d['time'] );
			})
			.attr("cy", function(d) {
				return opts.yScale( d['value'] );
			})

		// // Add annotations
		// if (state !== 'refresh') {
		// 	var annotations = d3.select('#group-Iowa')
		// 		.append('text')
		// 		.attr('class', 'annotations')

		// 	// Annotation text goes here
		// 	annotations.append('tspan')
		// 		.attr("x","30")
		// 		.attr("y","100")
		// 		.html(function(d) {
		// 			return "Branstad's most used words is 'Iowa/Iowans', which"
		// 		})

		// 	annotations.append('tspan')
		// 		.attr("x","30")
		// 		.attr("y","115")
		// 		.html(function(d) {
		// 			return "has been used frequently in the last five years"
		// 		})

		// 	annotations.append('tspan')
		// 		.attr("x","30")
		// 		.attr("y","130")
		// 		.html(function(d) {
		// 			return "but saw a dip this year."
		// 		})

		// 	var annotations_three = d3.select('#group-we')
		// 		.append('text')
		// 		.attr('class', 'annotations')

		// 	annotations_three.append('tspan')
		// 		.attr("x", function(d) {
		// 			return $(window).width() / 2
		// 		})
		// 		.attr("y","215")
		// 		.html(function(d) {
		// 			return "Text goes here. Text goes here."
		// 		})

		// 	annotations_three.append('tspan')
		// 		.attr("x", function(d) {
		// 			return $(window).width() / 2
		// 		})
		// 		.attr("y","230")
		// 		.html(function(d) {
		// 			return "Text goes here. Text goes here."
		// 		})

		// 	var annotations_two = d3.select('#group-I')
		// 		.append('text')
		// 		.attr('class', 'annotations')

		// 	annotations_two.append('tspan')
		// 		.attr("x", function(d) {
		// 			return $(window).width() / 2 - 25
		// 		})
		// 		.attr("y","200")
		// 		.html(function(d) {
		// 			return "In what will likely be his last state of the state speech,"
		// 		})

		// 	annotations_two.append('tspan')
		// 		.attr("x", function(d) {
		// 			return $(window).width() / 2 - 25
		// 		})
		// 		.attr("y","215")
		// 		.html(function(d) {
		// 			return "Branstad chose to use the word 'I' more than usual."
		// 		})
		// } else {
		// 	var annotations = svg.select('.annotation')
		// }

		// Create tooltip
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
	setIterationOptions: function(column, num, state) {
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
		chart.createChart(column, num, state);
	},

	// Sets view options on render and window resize
	// After that, it loads D3
	setDefaultOptions: function(state) {
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
	    .ticks(5)
	    .scale(opts.xScale)
	    .tickSize(-opts.height_g, 0)
	    .orient("bottom");

		opts.yAxis = d3.svg.axis()
	    .scale(opts.yScale)
	    .ticks(10)
	    .tickSize(-opts.width_g, 0)
	    .tickFormat(function(d) {
				return commaNumbers(d);
			})
		.orient("left");

		// Load data after scales have been set
		chart.loadD3(state);
	// Close set global vars
	}
// Close view
});