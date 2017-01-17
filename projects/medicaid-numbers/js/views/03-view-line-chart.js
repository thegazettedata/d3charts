var color;

var LineChartView = TooltipView.extend({
	// This is called with our global CSV data
	// It creates a chart and appends to DOM
	createChart: function(column, num, state) {
		var chart = this;
		var opts = chart.options;
		var data = opts.data;

		if (state !== 'refresh') {
			data.forEach(function(d) {
				var quarter_year = d[ opts.chartable_columns[0] ].split(' ');
				var quarter = quarter_year[0];
				var year = quarter_year[1].replace('SFY','20').replace('FY','20');

				if (quarter == 'Q1') {
					var month = '01'
				} else if (quarter == 'Q2') {
					var month = '04'
				} else if (quarter == 'Q3') {
					var month = '07'
				} else if (quarter == 'Q4') {
					var month = '10'
				}

				var date_formatted = parseDateYearFirst(year + '-' + month + '-01');

				// Pull year out of chartable column
				// Which is declared in the render file
				d['quarter_written'] = d[  opts.chartable_columns[0] ]
				d[ opts.chartable_columns[0] ] = date_formatted;
			});
		// Close if
		}

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
		color = d3.scale.category10();
		
		color.domain(d3.keys(data[0]).filter(function(key) {
			// Only return newly formatted dataset array item
			// If it's listed in the chartable_values variable
			// Which is set on chart view initialization
			if ($.inArray(key, opts.chartable_values) > -1) {
				return key !== opts.chartable_columns[0];
			}
		}))
		.range(colorbrewer.Set1[3]);

		// Keep track of every line we noted
		// So we can draw it later
		var line_pre_transition = d3.svg.line()
		  // .interpolate("basis")
			.x(function(d) {
		  	return 35;
		  })
		  .y(function(d) {
		  	return opts.yScale( d['value'] );
		  });

		 var line = d3.svg.line()
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
		var path = svg.selectAll(".group")
			.data(dataset)

		// Create a group, which we will add lines and circles to
		// Create new path if we're not refreshing
		if (state !== 'refresh') {
			path.enter()
				.append("g")
				.attr("class", function(d) {
					return 'group-' + d['name'] + ' group';
				})
	      	
			path.append("path")
				.attr("class", "line")
				.style("stroke", function(d) {
					if (d['name'] == 'requirement') {
						return '#e41a1c';
					} else {
						return color( d['name'] );
					}
				})
				.style("stroke-width", function(d) {
					if (d['name'] == 'requirement') {
						return '2px';
					}
				})
				.style("stroke-dasharray", function(d) {
					if (d['name'] == 'requirement') {
						return '2px';
					}
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
				.attr("r", 5)
				.style("fill", function(d) {
					var name = d3.select(this.parentNode).datum()['name'];
					return color(name);
				})
				.style('display', function(d) {
					var name = d3.select(this.parentNode).datum()['name'];
					if (name == 'requirement') {
						return 'none';
					}
				})
		}
			
		// Draw or re-draw lines
		if (state !== 'refresh') {
			path.attr("d", function(d) {
				return line_pre_transition( d['values'] );
			})
			.transition()
			.duration(750)
			.delay(function (d, i) {
				return i * 50;
			})
			.attr("d", function(d) {
				if (d['name'] == 'requirement') {
					opts.xScale.range([ 0, opts.width_g + 20 ]);
				} else {
					opts.xScale.range([ 30, opts.width_g - 30 ]);
				}

				return line( d['values'] );
			})
		} else {
			path.attr("d", function(d) {
				if (d['name'] == 'requirement') {
					opts.xScale.range([ 0, opts.width_g + 20 ]);
				} else {
					opts.xScale.range([ 30, opts.width_g - 30 ]);
				}

				return line( d['values'] );
			})
		}

		// Position or re-position circles
		if (state !== 'refresh') {
			circle.attr("cx", function(d) {
				return 35;
			})
			.attr("cy", function(d) {
				return opts.yScale( d['value'] );
			})
			.transition()
			.duration(750)
			.delay(function (d, i) {
				return i * 50;
			})
			.attr("cx", function(d) {
				opts.xScale.range([ 30, opts.width_g - 30 ]);
				return opts.xScale( d['time'] );
			})
			.attr("cy", function(d) {
				return opts.yScale( d['value'] );
			})
		} else {
			circle.attr("cx", function(d) {
				opts.xScale.range([ 30, opts.width_g - 30 ]);
				return opts.xScale( d['time'] );
			})
			.attr("cy", function(d) {
				return opts.yScale( d['value'] );
			})
		}

		// Put key on DOM
		if (state !== 'refresh') {
			// Create tooltip
			chart.tooltipEvents(circle, num);
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
			.range([ 30, opts.width_g - 30 ]);

		opts.yScale = d3.scale.linear()
			.domain(opts.yscale_domain)
			.range([ opts.height_g - 20, 0 ]);

		if (opts.data.length >= 5) {
			var x_ticks = 4;
		} else {
			var x_ticks = opts.data.length;
		}

		opts.xAxis = d3.svg.axis()
	    .scale(opts.xScale)
	    .tickSize(-opts.height_g, 0)
	    .ticks(x_ticks)
	    .tickFormat(function(d) {
				var year = 'SFY' + String( d.getFullYear() ).replace('20','');
				var month = d.getMonth() + 1;
				var hide_tick = false;

				if (month == 1) {
					var quarter = 'Q1'
				} else if (month == 4) {
					var quarter = 'Q2'
				} else if (month == 7) {
					var quarter = 'Q3'
				} else if (month == 10) {
					var quarter = 'Q4'
				} else {
					hide_tick = true;
				}

				if (!hide_tick) {
					return quarter + ' ' + year;
				}
			})
	    .orient("bottom");

		opts.yAxis = d3.svg.axis()
	    .scale(opts.yScale)
	    .ticks(5)
	    .tickSize(-opts.width_g, 0)
	    .tickFormat(function(d) {
				if (opts['tick_format'] == 'percent') {
					return commaNumbers(d) + '%';
				} else {
					return '$' + commaNumbers(d);
				}
			})
		.orient("left");

		// Load data after scales have been set
		chart.loadD3(state);
	// Close set global vars
	}
// Close view
});