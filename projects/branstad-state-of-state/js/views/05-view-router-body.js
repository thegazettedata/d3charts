var chartview;

// Body view
var AppView = Backbone.View.extend({
  el: 'body',

  events: {
    'click btn': 'toggleWords',
  },

  // Hide, show different charts
  toggleWords: function(e) {
    // Prevent anchor tag behavior
    e.preventDefault()
    var btn = $(e.target);
    var btn_text = btn.text();

    // Buttons
    $(btn).addClass('selected');
    $(btn).siblings().removeClass('selected');

    var groups = d3.selectAll('.group')
      .transition()
      .duration(750)
      .attr('opacity', 0)
      .select('.line')
      .style({
        'stroke-width': '2px'
      })

    var selected_group = d3.select('#group-' + btn_text)
      .transition()
      .duration(750)
      .attr('opacity', 1)
      .select('.line')
      .style({
        'stroke-width': '8px'
      })



    // Google Analytics
    ga('send', 'event', project_name, 'Toggle words');
  },

  initialize: function() {
      // this.render();
  },

  render: function() {
  }
});

// Hash navigation
var AppRouter = Backbone.Router.extend({
  routes: {
    "": "loadChart",
    "*chart": "loadChart"
  },

  loadChart: function() {
    var hash = Backbone.history.getFragment();
  }
});

var approuter = new AppRouter();
var appview = new AppView();

// Fire up Backbone
Backbone.history.start();

// Call model, which sets values
// And calls view of new chart
var chart_rendered = new ChartModel();