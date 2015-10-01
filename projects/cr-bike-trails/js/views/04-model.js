// Chart model with our data
var ChartModel = Backbone.Model.extend({
    // Default values for our view
    defaults: {
    	// Set for the first chart we load
    	'el': '#svg-one-container',
        'el_num': 'one',
    	'header': 'Miles built per year',
    	// Each column in the data we want to chart
    	// This will be plotted as separate charts
        'chartable_columns': ['Length'],
        // First column in SS
        // Used for scale
        'column_index': 'Year Built',
    	'csv': 'data/trails.csv',
        'xscale_domain': [0, 8],
    	'padding': [0, 10, 20, 55],
    	'height': 0,
        'height-full': 225,
        'height-650': 175
    },

    initialize: function() {
    	var hash = Backbone.history.getFragment();

        // Set different heights for chart at different sizes
        if ( $(window).width() > 650) {
            this.set('height',this.defaults['height-full']);
        } else {
            this.set('height',this.defaults['height-650']);
        }

    	// Ran if we are toggling charts
    	// if (hash !== '') {
    	// 	hash_format = hash.replace('chart-','')

    	// 	// Set CSV link
    	// 	this.set('csv', 'data/' + hash_format + '.csv');

    	// 	if (hash_format === 'diabetes-er-visits') {
    	// 		this.set('header', 'Diabetes ER visit rate (age-adjusted 100,000)');
    	// 	}
    	// }

        // Set headline
        // var el_container = '#chart-' + this.get('el_num') + '-container';
        // $(el_container + ' h4').html( this.get('header') )

        // Render chart view with custom options
        barchartview = new BarChartView(this.attributes)
        pymChild = new pym.Child({ renderCallback: barchartview.render()  });
    }
});