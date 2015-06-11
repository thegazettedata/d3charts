// Chart model with our data
var ChartModel = Backbone.Model.extend({
    // Default values for our view
    defaults: {
    	'el': 'one',
    	'header': 'Diabetes hospitalization rate (age-adjusted 100,000)',
    	'el_chart': '#svg-one-container',
    	'columns': ['year'],
    	'values': ['Johnson', 'Linn', 'State'],
    	'csv': 'data/diabetes-hospitalizations.csv',
    	'yscale_domain': [70,180],
    	'padding': [10, 30, 15, 35],
    	'height': 200,
    },

    initialize: function() {
    	var hash = Backbone.history.getFragment();

    	// Ran if we are toggling charts
    	if (hash !== '') {
    		hash_format = hash.replace('chart-','')

    		// Set CSV link
    		this.set('csv', 'data/' + hash_format + '.csv');

    		// Charts: Diabetes
    		if (hash_format === 'diabetes-er-visits') {
    			this.set('header', 'Diabetes ER visit rate (age-adjusted 100,000)');
    		
    		// Charts: Heart related
    		} else if (hash_format.indexOf('heart') > -1) {
    			this.set('el', 'two');
    			this.set('yscale_domain',[70,280]);

    			if (hash_format === 'heart-attack-hospitalizations') {
    				this.set('header', 'Heart attack hospitalization rate (age-adjusted 100,000)');
    			} else if (hash_format === 'heart-failure-hospitalizations') {
    				this.set('header', 'Heart failure hospitalization rate (age-adjusted 100,000)');
    			}
    		
    		// Chart: Suicide
    		} else if (hash_format === 'suicide-rates') {
    			this.set('el', 'three');
    			this.set('yscale_domain',[7,15]);

    			this.set('header', 'Suicide death rate (age-adjusted 100,000)');

    		// Charts: Birth
	    	} else if (hash_format.indexOf('birth') > -1) {
	    		this.set('el', 'four');
	    		this.set('yscale_domain',[5,35]);

	    		if (hash_format === 'birth-rates') {
	    			this.set('header', 'Birth rate (per 1,000)');
	    		} else if (hash_format === 'birth-teen-rates') {
	    			this.set('header', 'Teen birth rate - ages 15-19 (per 1,000)');
	    		}
	    	}
    	}

        // Set headline
        var el_container = '#chart-' + this.get('el') + '-container';
        $(el_container + ' h4').html( this.get('header') )

        // Show, hide current DIVs
        $(el_container).show();
        $(el_container).siblings().hide();

        // Render chart view with custom options
        linechartview = new LineChartView({
            el: '#svg-' + this.get('el') + '-container',
            el_num: this.get('el'),
            csv: this.get('csv'),
            chartable_columns: this.get('columns'),
            chartable_values: this.get('values'),
            yscale_domain: this.get('yscale_domain'),
            padding: this.get('padding'),
            height: this.get('height')
        }).render();
    }
});