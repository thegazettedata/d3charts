// Chart model with our data
var ChartModel = Backbone.Model.extend({
  // Default values for our view
  defaults: {
    // DIV number on page
    'el_num': 'one',
    'csv': 'data/word-counts.csv',
    // Time value, x axis
    'chartable_columns': ['year'],
    // Lines in our line chart will correspond with these columns
    'chartable_values': ['we', 'Iowa', 'I', 'together', 'new', 'jobs', 'students', 'future', 'schools', 'opportunity', 'economy', 'education', 'children', 'government', 'community', 'health', ],
    // Columns with data that we only want to use in the tooltip
    'tooltip_columns': [],
    // Y scale domain
    'yscale_domain': [0,100],
    'padding': [10, 30, 15, 35],
    'height': 0,
    'height-full': 500
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