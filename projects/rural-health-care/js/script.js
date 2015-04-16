// Each column in the data we want to chart
var svg;

var chartable_data = ['pop_17_under','pop_18_34','pop_35_54','pop_55_64','pop_65_older'];

// Global variables that will be set once the page loads
var width;
var height;
var padding;
var xScale;
var yScale;
var xAxis;
var yAxis;

var tooltip = d3.select("#tooltip");

// This is called with our global CSV data
// It creates a chart and appends to DOM
function createChart(data, column, num) {
	// Only show x-axis on the first 
	if (num !== 0) {
		height = 40;
		padding[0] = 0;
		yScale.rangeRoundBands([ 0, height - padding[2] ], 0.15);
	}

	// Text that will be shown
	var column_pretty = 'Ages ' + column.replace('pop_', '').replace('_', ' - ')
	if ( column_pretty.indexOf(17) > -1 ) {
		column_pretty = 'Percent of population: Ages 17 and under';
	} else if ( column_pretty.indexOf(65) > -1 ) {
		column_pretty = 'Ages 65 and older';
	}

	var title = d3.select('#svg-container').append('h5')
		.html(column_pretty)

	// Create empty SVG so we can append data to it later
	svg = d3.select('#svg-container').append("svg")
		.attr("width", width)
		.attr("height", height)

	// Map school name to school value
	yScale.domain(data.map(function(d) {
		return d['area'];
	} ));

	// Create rectangles and append to DOM
	var rects = svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect");

	// Set attributes
	rects.attr({
			"class": function(d, num) {
				return d;
			},
			"x": padding[3],
			"y": function(d, num) {
				return yScale( d['area'] );
			},
			"width": function(d) {
				return xScale( d[column] );
			},
			"height": yScale.rangeBand(),
			"fill": function(d) {
				if (d['area'] === 'Rural') {
					return '#006d2c';
				} else {
					return '#bae4b3';
				}
			}
		})

	// Append x axis
	svg.append("g")
		.attr({
			"id": "axis-" + num,
			"class": "x-axis axis",
			"transform": "translate(" + padding[3] + "," + padding[0] + ")"
		})
		.call(xAxis);


	// Append y axis
	svg.append("g")
		.attr({
			"class": "y-axis axis",
			"transform": "translate(" + padding[3] + ",0)"
		})
		.call(yAxis)

	// Need the SVG done before we call the tooltip function
	rects.on("mouseover", function (d) {
			$('#tooltip').html( d['area'] + ': ' + d[ chartable_data[num] ] + '%'); 

       		return tooltip.style("visibility", "visible");
        })
    	.on("mousemove", function () {
        	return tooltip
            	.style("top", (d3.event.pageY + 16) + "px")
            	.style("left", (d3.event.pageX + 16) + "px");
    	})
    	.on("mouseout", function () {
    		return tooltip.style("visibility", "hidden");
		});
// Close create charts
}

// Load CSV data
function loadD3() {
	// Load CSV data
	d3.csv("data/rural_urban.csv", function(data) {
		// Loop through every column in the data we want to chart
		// And call the create chart function with its value
		_.each(chartable_data, function(val, num) {
			createChart(data, val, num);
		});
	});
// Close load D3
}

// Sets global varaibles on doc ready and window resize
// After that, it loads D3
function setGlobalVariables() {
	// Chart properties
	width = $(window).width();
	height = 60;
	padding = [20, 15, 0, 55];

	// Determines width of bars
	// Based on data values
	xScale = d3.scale.linear()
		// This is the input
		// Set to max value we want to see on x-axis
		.domain([ 0, 30])
		// This is what is outputted
		.range([ 0, width - padding[1] - padding[3] ]);

	// Determines height of bars
	// Based on number of values total
	yScale = d3.scale.ordinal()
		// This is what is outputted
		.rangeRoundBands([ padding[0], height - padding[2] ], 0.15);

	// Numbers that go left to right
	xAxis = d3.svg.axis()
		.scale(xScale)
		// Number of ticks we'll see from left to right
		.ticks(10)
		// Add %
		.tickFormat(function(d) {
			return d + '%';
		})
		// This makes it so the ticks go down height of the chart
		// Effectively making a grid
		.tickSize(-height, 0)
		.orient("top");

	// Names on the left of the chart
	yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	// Load data
	loadD3();
// Close set global vars
}

$(document).ready(function() {
	if (window.location.hash === '#chart-one') {
		$('#chart-one-container').show();
		setGlobalVariables();

		$('body').mouseleave(function() {
			ga('send', 'event', 'Rural health care part 4', 'Chart 1 touched');
		});
	}
})

$(window).resize(function() {
	if (window.location.hash === '#chart-one') {
		d3.selectAll("svg").remove();
		d3.selectAll("h5").remove();
		setGlobalVariables();
	}
})