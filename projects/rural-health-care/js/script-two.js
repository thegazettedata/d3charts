// Global variables that will be set once the page loads
var svg;

// var width;
// var height;
// var padding;
var width_g;
var height_g;

// var xScale;
// var yScale;

var line;
var area;

var parseDate = d3.time.format("%d-%b-%y").parse;
var parseYear = d3.time.format("%Y").parse;

var tooltip_two = d3.select("#tooltip-two");

function loadD3Two() {
	svg = d3.select('#svg-container-two').append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
			.attr("transform", "translate(" + padding[3] + "," + padding[0] + ")");
		
	focus = svg.append("g")
		.style("display", "none");

	d3.csv("data/medicare_medicaid.csv", function(error, data) {
		data.forEach(function(d) {
    		d['year'] = parseDate( d['year'] );
    		d['medicaid_percent'] = +d['medicaid_percent'];
  		});

		xScale.domain(d3.extent(data, function(d) {
			return d['year'];
		}));

	  	// The area under the line
	  	svg.append("path")
	      .datum(data)
	      .attr("class", "area")
	      .attr("d", area);

      	// The line
      	svg.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);

		// X-axis
		svg.append("g")
			.attr("class", "x-axis-two axis-two")
			.attr("transform", "translate(0," + height_g + ")")
			.call(xAxis);

		// Y-axis
		svg.append("g")
			.attr("class", "y-axis-two axis-two")
			.call(yAxis)

		// Draw the dots on the line chart
		svg.selectAll("circle")									
			.data(data)											
			.enter()
			.append("circle")								
				.attr("r", 3)
				.attr("cx", function(d) {
					return xScale( d['year'] );
				})
				.attr("cy", function(d) {
					return yScale( d['medicaid_percent'] );
				})
			// Add hover effect
			.on("mouseover", function (d) {
				var date = new Date( d['year'] );
				var year = date.getFullYear();
				
				var tooltip_html = "<div>";
				tooltip_html += "Medicaid eligibles in " + year + ': ' + commaSeparateNumber(d['medicaid_eligibles'])
				tooltip_html += "</div><div>";
				tooltip_html += "Iowa's population: " + commaSeparateNumber(d['population'])
				tooltip_html += "</div>";

				$('#tooltip-two').html(tooltip_html); 

	       		return tooltip_two.style("visibility", "visible");
	        })
	    	.on("mousemove", function () {
	    		// This determines if we are hovering over a dot
	    		// On the left or right side of the screen
	    		var left_right = $(window).width() / d3.event.pageX;

	    		if (left_right > 2) {
	    			var left_position = -16;
	    		} else {
	    			var left_position = 250;
	    		}

	        	return tooltip_two
	            	.style("top", (d3.event.pageY + 16) + "px")
	            	.style("left", (d3.event.pageX - left_position) + "px");
	    	})
	    	.on("mouseout", function () {
	    		return tooltip_two.style("visibility", "hidden");
			});
	// Close load CSV
	});
// Close function load D3
}

// Sets global varaibles on doc ready and window resize
// After that, it loads D3
function setGlobalVariablesTwo() {
	// Chart properties
	width = $(window).width();
	height = 200;
	padding = [20, 10, 55, 45];
	
	// This sets height of the g element, where the chart is actually place
	// This makes room for 
	height_g = height - padding[0] -  padding[2];
	width_g = width - padding[1] - padding[3];

	xScale = d3.time.scale()
    	.range([ 0, width_g ]);

    yScale = d3.scale.linear()
    	.domain([0, 20])
    	.range([ height_g, 0 ]);

    xAxis = d3.svg.axis()
    	.scale(xScale)
    	.tickSize(-height_g, 0)
    	.orient("bottom");

	yAxis = d3.svg.axis()
    	.scale(yScale)
    	.ticks(5)
    	.tickSize(-width_g, 0)
    	.tickFormat(function(d) {
			return d + '%';
		})
    	.orient("left");

	line = d3.svg.line()
		.x(function(d) {
			return xScale( d['year'] );
		})
		.y(function(d) {
			return yScale( d['medicaid_percent'] );
		})

	area = d3.svg.area()
		.x(function(d) {
			return xScale( d['year'] );
		})
		.y0(height_g)
		.y1(function(d) {
			return yScale( d['medicaid_percent'] );
		});

	// Load data
	loadD3Two();
// Close set global vars
}

$(document).ready(function() {
	if (window.location.hash === '#chart-two') {
		$('#chart-two-container').show();
		setGlobalVariablesTwo();

		$('body').mouseleave(function() {
			ga('send', 'event', 'Rural health care part 4', 'Chart 2 touched');
		});
	}
})

$(window).resize(function() {
	if (window.location.hash === '#chart-two') {
		d3.selectAll("svg").remove();
		d3.selectAll("h5").remove();
		setGlobalVariablesTwo();
	}
})