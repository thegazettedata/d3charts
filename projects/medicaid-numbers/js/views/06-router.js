// Hash navigation
var AppRouter = Backbone.Router.extend({
  routes: {
    "": "loadChart",
    "*chart": "loadChart"
  },

  loadChart: function() {}
});

var approuter = new AppRouter();

// Fire up Backbone
Backbone.history.start();