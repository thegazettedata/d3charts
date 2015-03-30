function createNameBoxes() {
	var svg = d3.select("svg");
	var text = svg.selectAll("g.node").select('text');
	var text_boxes = [];
	var nodes = svg.selectAll("g.node");

	// Find binding boxes for each text element
	text.each(function(val, num) {
		var text_data = $(this)[0].getBBox();
		text_data['name'] = val['name'];

		text_boxes.push( text_data );
	});

	// Create rect around every text element
	nodes.insert('rect', ":first-child")
		// Use data from the array we created with binding box info
		.data(text_boxes)
		.text(function(d) {
    		return d['name'];
    	})
    	.attr("class", "background")
		.attr("width", function(d) {
			return d['width']
		})
		.attr("height", function(d) {
			return d['height']
		})
		.attr("x", function(d) {
			return d['x']
		})
		.attr("y", function(d) {
			return d['y']
		});
// close create name boxes
}