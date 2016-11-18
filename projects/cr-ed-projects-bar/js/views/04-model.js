// Chart model with our data
var ChartModel = Backbone.Model.extend({
  // Default values for our view
  defaults: {
    // Set for the first chart we load
    'el_num': 'one',
    // Location of data
    'csv': 'data/projects-by-year.csv',
    // Each column in the data we want to chart
    // This will be plotted as separate charts
    'chartable_columns': ['projects'],
    // First column in SS
    // Used for scale
    'column_index': 'year',
    'xscale_domain': [0, 210],
    'padding': [20, 15, 0, 55],
    'height': 0,
    'height-full': 420
  },

  initialize: function() {
    var hash = Backbone.history.getFragment();

    // Set DIV of chart
    this.set('el', '#svg-' + this.get('el_num') + '-container');

    // Set different heights for chart at different sizes
    this.set('height',this.defaults['height-full']);

    // Set headline
    var el_container = '#chart-' + this.get('el_num') + '-container';

    // Render chart view with custom options
    chartview = new BarChartView(this.attributes)
    pymChild = new pym.Child({ renderCallback: chartview.render()  });
  }
});