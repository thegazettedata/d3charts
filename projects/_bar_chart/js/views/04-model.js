// Chart model with our data
var ChartModel = Backbone.Model.extend({
    // Default values for our view
    defaults: {
    	// Set for the first chart we load
    	'el_num': 'one',
    	'header': 'Rural v. urban Iowa',
    	// Each column in the data we want to chart
    	// This will be plotted as separate charts
        'columns': ['pop_17_under','pop_18_34','pop_35_54','pop_55_64','pop_65_older'],
        // First column in SS
        // Used for scale
        'column_index': 'area',
    	'csv': 'data/rural_urban.csv',
    	'xscale_domain': [0, 30],
    	'padding': [20, 15, 0, 55],
    	'height': 60,
    },

    initialize: function() {
    	var hash = Backbone.history.getFragment();

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
        var el_container = '#chart-' + this.get('el_num') + '-container';
        $(el_container + ' h4').html( this.get('header') )

        // Render chart view with custom options
        linechartview = new BarChartView({
            el: '#svg-' + this.get('el_num') + '-container',
            el_num: this.get('el_num'),
            csv: this.get('csv'),
            chartable_columns: this.get('columns'),
            column_index: this.get('column_index'),
            xscale_domain: this.get('xscale_domain'),
            padding: this.get('padding'),
            height: this.get('height')
        }).render();
    }
});