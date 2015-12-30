// Chart model with our data
var ChartModel = Backbone.Model.extend({
  // Default values for our view
  defaults: {
    // DIV number on page
    'el_num': 'one',
      // Headline for chart
    'header': 'Gun purchase background checks in Iowa',
    // Location of data
    'csv': 'data/nics-firearm-background-checks-ia-trim.csv',
    // Time value, x axis
    'chartable_columns': ['year_month'],
    // Lines in our line chart will correspond with these columns
    'chartable_values': ['permit_adjusted'],
    // Columns with data that we only want to use in the tooltip
    'tooltip_columns': [],
    // Y scale domain
    'yscale_domain': [0,25000],
    'padding': [10, 30, 15, 55],
    'height-550': 175,
    'height-full': 250
  },

  initialize: function() {
    var hash = Backbone.history.getFragment();
        
    // Set DIV of chart
    this.set('el', '#svg-' + this.get('el_num') + '-container');

    // Set different heights for chart at different sizes
    this.set('height',this.defaults['height-full']);
    
    if ( $(window).width() > 550) {
        this.set('height',this.defaults['height-full']);
    } else {
        this.set('height',this.defaults['height-550']);
    }
        
    // Ran if we are toggling charts
    if (hash !== '') {
      this['attributes']['chartable_values'] = hash.split('-');

      // Concealed carry chart
      if (hash.indexOf('concealed') > -1) {
        this['attributes']['csv'] = 'data/concealed-month.csv';
        this.set('header','Concealed carry permits issued in Iowa');
        this['attributes']['yscale_domain'] = [0,20000];

        $('#toggle-view-concealed').show();
      // Long gun, handgun chart
      } else if (hash.indexOf('permit') === -1) {
        this['attributes']['yscale_domain'] = [0,6000];
        this.set('header','Long gun v. handgun permit requests');
        $('.annotation').hide();
        $('#key').show()
      // Other charts
      // i.e. Permits
      } else if (hash.indexOf('permit') > -1) {
        $('#toggle-view-permit').show();
      }
    } else {
      Backbone.history.navigate('permit_adjusted', {trigger: true});
      $('#toggle-view-permit').show();
    }

    // Set headline
    var el_container = '#chart-' + this.get('el_num') + '-container';
    $(el_container + ' h4').html( this.get('header') )

    // Render chart view with custom options
    chartview = new LineChartView(this.attributes);
    pymChild = new pym.Child({ renderCallback: chartview.render()  });
  }
});