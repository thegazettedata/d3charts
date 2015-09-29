// Body view
var AppView = Backbone.View.extend({
    el: 'body',
    
    events: {
        'click .toggle-view-option': 'toggleView',
    },

    // Hide, show different charts
    toggleView: function(e) {
        // Prevent anchor tag behavior
        e.preventDefault()
        var target = e.target;

        // Call correct route to load chart
        var href = $(target).attr('href');
        Backbone.history.navigate(href, {trigger: true});

        // Change styles of toggle buttons
        $(target).addClass('selected');
        $(target).siblings().removeClass('selected');

        // Google Analytics
        ga('send', 'event', project_name, 'Toggle view');
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

    // Default
    loadChart: function(id) {
        var hash = Backbone.history.getFragment();

        // Remove chart on page if we're reloading a chart
        // This is triggered by the toggle buttons
        if (String(typeof d3.select('svg')[0][0]) !== 'null') {
            d3.selectAll("svg").remove();
            d3.selectAll("h5").remove();
        }

        // Call model, which sets values
        // And calls view of new chart
        chart_rendered = new ChartModel();

        // Select the correct toggle button on initial load
        $('#' + hash).click()
    }
});

var approuter = new AppRouter();
var appview = new AppView();

 // Fire up Backbone
Backbone.history.start();