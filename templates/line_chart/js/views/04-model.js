// Chart model with our data
var ChartModel = Backbone.Model.extend({
    // Default values for our view
    defaults: {
    	// Set for the first chart we load
    	'el_num': 'one',
    	'header': 'Diabetes hospitalization rate (age-adjusted 100,000)',
    	'columns': ['year'],
    	'values': ['Johnson', 'Linn', 'State'],
    	'csv': 'data/diabetes-hospitalizations.csv',
    	'yscale_domain': [70,180],
    	'padding': [10, 30, 15, 35],
    	'height': 250,
    },

    initialize: function() {
    	var hash = Backbone.history.getFragment();

    	// Ran if we are toggling charts
    	if (hash !== '') {
    		hash_format = hash.replace('chart-','')

    		// Set CSV link
    		this.set('csv', 'data/' + hash_format + '.csv');

    		if (hash_format === 'diabetes-er-visits') {
    			this.set('header', 'Diabetes ER visit rate (age-adjusted 100,000)');
    		}
    	}

        // Set headline
        var el_container = '#chart-' + this.get('el_num') + '-container';
        $(el_container + ' h4').html( this.get('header') )

        // Render chart view with custom options
        linechartview = new LineChartView({
            el: '#svg-' + this.get('el_num') + '-container',
            el_num: this.get('el_num'),
            csv: this.get('csv'),
            chartable_columns: this.get('columns'),
            chartable_values: this.get('values'),
            yscale_domain: this.get('yscale_domain'),
            padding: this.get('padding'),
            height: this.get('height')
        }).render();
    }
});