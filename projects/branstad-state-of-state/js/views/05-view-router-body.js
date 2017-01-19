var chartview;

// Body view
var AppView = Backbone.View.extend({
  el: 'body',

  events: {
    'click .dropdown-menu li': 'toggleWords',
  },

  // Hide, show different charts
  toggleWords: function(e) {
    // Prevent anchor tag behavior
    e.preventDefault()
    var btn = $(e.target);
    var btn_text = btn.attr('href').replace('#','');
    var word_count = btn.attr('data-word-count');
    var annotation_div = $('#annotation-' + btn_text);
    var annotation_header = $('#annotation-' + btn_text + ' h2');
    var path_color = d3.select('#group-' + btn_text).select('.line').style('stroke');

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

    $(annotation_div).siblings().hide();
    $(annotation_div).fadeIn();
    $(annotation_div).find('.word-count').text(word_count);
    $(annotation_header).css('color', path_color);

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