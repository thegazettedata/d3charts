// Chart model with our data
var ChartModel = Backbone.Model.extend({
    // Default values for our view
    defaults: {
    	// Set for the first chart we load
    	'el': '#chart-one-container',
    	'header': 'Diabetes hospitalization rate (age-adjusted 100,000)',
    	'el_chart': '#svg-one-container',
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

        $(this.get('el') + ' h4').html( this.get('header') )

        // Render chart view with custom options
        linechartview = new LineChartView({
            el: this.get('el_chart'),
            csv: this.get('csv'),
            chartable_columns: this.get('columns'),
            chartable_values: this.get('values'),
            yscale_domain: this.get('yscale_domain'),
            padding: this.get('padding'),
            height: this.get('height')
        }).render();
    }
});