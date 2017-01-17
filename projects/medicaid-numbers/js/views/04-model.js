var chartviews = []

// Chart model with our data
var ChartModel = Backbone.Model.extend({
  // Default values for our view
  defaults: {
    // Dom element
    'el_num': 1,
    'el': '#svg-1-container',
    // Data information
    'data': {},
    // Each column in the data we want to chart
    // This will be plotted as separate charts
    'chartable_columns': ['number'],
    // First column in SS
    // Used for scale
    'column_index': 'age',
    // Chart options
    'xscale_domain': [0, 250000],
    'padding': [20, 10, 0, 50],
    'height': 150,
    'width': $(window).width() / 2
  },

  initialize: function() {
    var chart_type = this.attributes['chart_type'];

    // Set DIV of chart
    this.set('el', '#svg-' + this.get('el_num') + '-container');

    // Render chart view with custom options
    if (chart_type == 'bar') {
      var chartview = new BarChartView(this.attributes);
    } else if (chart_type == 'line') {
      var chartview = new LineChartView(this.attributes);
    }

    chartviews.push(chartview);

    // Render pym
    pymChild = new pym.Child({ renderCallback: chartview.render()  });
  }
});