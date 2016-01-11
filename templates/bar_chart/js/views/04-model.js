// Chart model with our data
var ChartModel = Backbone.Model.extend({
  // Default values for our view
  defaults: {
    // Set for the first chart we load
    'el_num': 'one',
    'header': 'Diabetes hospitalization rate (age-adjusted 100,000)',
    // Location of data
    'csv': 'data/diabetes-hospitalizations.csv',
    // Each column in the data we want to chart
    // This will be plotted as separate charts
    'chartable_columns': ['Johnson'],
    'column_index': 'year',
    'padding': [20, 0, 20, 55],
    'height': 0,
    'height-full': 260,
    'height-650': 175
  },

  initialize: function() {
    var hash = Backbone.history.getFragment();

    // Set DIV of chart
    this.set('el', '#svg-' + this.get('el_num') + '-container');

    // Set different heights for chart at different sizes
    if ( $(window).width() > 650) {
      this.set('height',this.defaults['height-full']);
    } else {
      this.set('height',this.defaults['height-650']);
    }

    // Ran if we are toggling charts
    if (hash !== '') {
      var hash_format = hash.replace('chart-','')

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
    chartview = new BarChartView(this.attributes)
    pymChild = new pym.Child({ renderCallback: chartview.render()  });
  }
});