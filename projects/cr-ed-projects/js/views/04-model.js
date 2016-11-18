// Chart model with our data
var ChartModel = Backbone.Model.extend({
  // Default values for our view
  defaults: {
    // DIV number on page
    'el_num': 'one',
    // Location of data
    'csv': 'data/projects-by-year.csv',
    // Time value, x axis
    'chartable_columns': ['year'],
    // Lines in our line chart will correspond with these columns
    'chartable_values': ['projects'],
    // Columns with data that we only want to use in the tooltip
    'tooltip_columns': [],
    // Y scale domain
    'yscale_domain': [-20,220],
    'padding': [10, 30, 15, 35],
    'height': 0,
    'height-full': 250
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
    chartview = new LineChartView(this.attributes);
    pymChild = new pym.Child({ renderCallback: chartview.render()  });
  // Close initialize
  }
// Close model
});