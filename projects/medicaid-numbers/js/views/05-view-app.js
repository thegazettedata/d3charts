var sheet_names = [0];

var chartview;

// Body view
var AppView = Backbone.View.extend({
  el: 'body',

  spreadsheet_key: '1Wa4qYgrLmDOcXli6Hf2tlxs8zK0SW7zZBZxDHKNcKpY',

  events: {
    'mouseover .key td': 'keyMouseOver',
    'mouseout .key': 'keyMouseOut'
  },

  keyMouseOver: function(e) {
    var target = $(e.target);
    var children = $(target).children('.text');
    var siblings = $(target).siblings('.text');

    if ( $(target).hasClass('text') ) {
      var text = $(target).text();
    } else if ( $(children).length > 0) {
      var text = $(children).text();
    } else if ( $(siblings).length > 0) {
      var text = $(siblings).text();
    }
    text = text.replace('Contract ','').toLowerCase();

    var groups = d3.selectAll('.group')
      .transition()
      .duration(250)
      .attr('opacity', 0.1)

    var selected_group = d3.selectAll('.group-' + text)
      .transition()
      .duration(250)
      .attr('opacity', 1)
  },

  keyMouseOut: function() {
    var groups = d3.selectAll('.group')
      .transition()
      .duration(250)
      .attr('opacity', 1)
  },


  buildTable: function(title, table_id, avgs, text_one, text_two, type, requirement_one, requirement_two) {
    if (requirement_one != undefined) {
      if (requirement_one > avgs[0]) {
        var avg_one_requirement = false;
      } else {
        var avg_one_requirement = true;
      }

      if (requirement_two > avgs[1]) {
        var avg_two_requirement = false;
      } else {
        var avg_two_requirement = true;
      }
    } else {
      var avg_one_requirement = true;
      var avg_two_requirement = true;
    }

    if (type == 'dollars') {
      avgs[0] = parseInt(avgs[0]);
      avgs[1] = parseInt(avgs[1]);
    }

    var html = '<h2>' + title + '</h2>';
    html += '<table id="' + table_id + '" class="fa-num-table">';
    html += '<tr>';
    if ( String(avgs[0]).indexOf('-') > -1 || !avg_one_requirement){
      html += '<td class="number red">';
    } else {
      html += '<td class="number green">';
    }
    html += '<div class="fa-num-container">'
    html += '<span id="num-one">'
    if (type != 'percent') {
      html += '$';
    }
    html += avgs[0]
    if (type == 'percent') {
      html += '%';
    }
    html += '</span>';
    html += '</div>';
    html += '</td>';
    
    if (text_two !== '') {
      html += '<td class="blank-td"></td>';
      if ( String(avgs[1]).indexOf('-') > -1  || !avg_two_requirement){
        html += '<td class="number red">';
      } else {
        html += '<td class="number green">';
      }
      html += '<div class="fa-num-container">'
      html += '<span id="num-two">'
      if (type != 'percent') {
        html += '$';
      }
      html += avgs[1];
      if (type == 'percent') {
        html += '%';
      }
      html += '</span>';
      html += '</div>'
      html += '</td>';
    }
    html += '</tr>';
    html += '<tr>';
    html += '<td class="table-note">' + text_one + '</td>';
    html += '<td class="blank-td"></td>';
    html += '<td class="table-note">' + text_two + '</td>';
    html += '</tr>';
    html += '</table>';

    return html;
  },

  findAvg: function(tabletop_data, avg_elements) {
    var avgs = [];

    _.each(avg_elements, function(val, num) {
      var last_element = tabletop_data[val]['elements'];
      last_element = last_element[last_element.length - 1];
      var total_cost = 0;
      var total = 0;

      _.each(last_element, function(val_two, num_two) {
        if ( String(parseFloat(val_two)) !== 'NaN' && num_two !== 'rowNumber') {
          total_cost += parseFloat(val_two);
          total += 1;
        }
      });

        var avg = parseFloat((total_cost / total).toFixed(1));
        avgs.push(avg);
      });

    return avgs;
  },

  loadTabletopData: function(tabletop_data, tabletop) {
    // Cached jQuery DOM elements
    var charts_containers = $('#charts-containers');
    var enrollment_table = $(charts_containers).find('#total-enrollment-table');
    var tabletop_data = _.sortKeysBy(tabletop_data);
    var final_html = ''

    // Create global variable of Tabletop sheet names
    _.each(tabletop_data, function(val, key) {
      sheet_names.push(key);
    });

    var num = 0;
    _.each(tabletop_data, function(val, name) {
      num += 1;
      var sheet_num = parseInt(name.split('~')[0]);
      var name = name.split('~')[1];

      // Tables with data
      if (sheet_num == 1) {
        var enrollment_num = commaSeparateNumber(val['elements'][0]['enrollment']);
        var last_updated = val['elements'][0]['lastupdated'];
        
        $('#last-updated').text('Last updated: ' + last_updated);
        $(enrollment_table).find('.number').text(enrollment_num);
      } else if ( name.indexOf('description') > -1 ) {
        var key = '<table class="key" cellspacing="2">'
        key += '<tr>';
        key += '<td>';
        key += '<div class="key-color color-two"></div>';
        key += '<span class="text">AmeriHealth</span>';
        key += '</td>';
        key += '<td>';
        key += '<div class="key-color color-one"></div>';
        key += '<span class="text">Amerigroup</span>';
        key += '</td>'
        key += '<td>';
        key += '<div class="key-color color-three"></div>';
        key += '<span class="text">UnitedHealthcare</span>';
        key += '</td>';
        if (sheet_num == 12 || sheet_num == 15) {
          key += '<td>';
          key += '<div class="key-color color-red"></div><div class="key-color color-red"></div><div class="key-color color-red"></div><div class="key-color color-red"></div>';
          key += '<span class="text">Contract requirement</span>';
          key += '</td>'
        }
        key += '</tr>';
        key += '</table>'

        var description = val['elements'][0]['description'];
        var html = '<p class="description">' + description + '</p>';
        html += '<p>* Data represents figures from the latest state fiscal quarter.'

        if (sheet_num == 4) {
          $(charts_containers).append(html);
        } else {
          var mobile_key = '<div class="hide-desktop show-700">"';
          mobile_key += key;
          mobile_key += '</div>';

          $('#svg-' + (sheet_num - 2) + '-container').append(mobile_key);
          $(charts_containers).append(key + html);
        }
      // Charts
      } else {
        // Used when we call the model
        var chart_attributes = {
          data: val['elements'],
          el_num: num
        }

        // Full width charts on mobile
        if ( $(window).width() < 700 ) {
          chart_attributes['width'] = $(window).width();
        }

        // Bar charts
        if (sheet_num == 2 || sheet_num == 3) {
          chart_attributes['chart_type'] = 'bar';
          if (name.indexOf('Enrollment by') > -1) {
            chart_attributes['column_index'] = name.split('Enrollment by ')[1].toLowerCase();
          }

          // Use the "number" to determine the max number on chart
          var max_element = _.max(val['elements'], function(elements){
            return parseFloat(elements['number']);
          });

          var max = Math.ceil( parseFloat(max_element['number']) / 100000) * 100000;
          chart_attributes['xscale_domain'] = [0, max];

          if (name == 'Enrollment by age') {
            chart_attributes['padding'] = [20, 35, 0, 50];
          } else {
            chart_attributes['padding'] = [20, 35, 0, 115];
          }

        // Line charts
        } else {
          // Put table with info above the first line chart
          // First, find the avg cost and percentages for the MCOs
          if (sheet_num == 5 || sheet_num == 10 || sheet_num == 13 || sheet_num == 8) {
            if (sheet_num != 8) {
              var avgs = appview.findAvg(tabletop_data, [sheet_names[sheet_num], sheet_names[sheet_num + 1]]);
            } else {
              var avgs = appview.findAvg(tabletop_data, [sheet_names[sheet_num]]);
            }
          
            // Then build the table
            if (sheet_num == 5) {
              var html = appview.buildTable('Average cost per month', 'avg-cost-table', avgs, 'for adults*', 'for children*', 'dollars');
            } else if (sheet_num == 8) {
              var html = appview.buildTable('Company profits or losses', 'profit-table', avgs, 'lost on average*', '', 'percent');
            } else if (sheet_num == 10 || sheet_num == 13) {
              var requirement_one = parseFloat(val['elements'][val['elements'].length - 1]['requirement']);
              var requirement_two = parseFloat(tabletop_data[sheet_names[sheet_num + 1]]['elements'][val['elements'].length - 1]['requirement']);

              if (sheet_num == 10) {
                var html = appview.buildTable('Medical claims paid on time', 'avg-cost-table', avgs, 'of claims were paid within 14 days*', 'of claims were paid within 21 days*', 'percent', requirement_one, requirement_two);
              } else {
                var html = appview.buildTable('Prior authorizations completed on time', 'pas-table', avgs, 'regular PAs were completed within 7 days*', 'expedited services authorized within 3 days*', 'percent', requirement_one, requirement_two);
              }
            }

            // Append table
            $(charts_containers).append(html);
          }

          chart_attributes['chart_type'] = 'line';
          chart_attributes['chartable_columns'] = ['quarter'];
          
          if ( $(window).width() > 700 ) {
            chart_attributes['height'] = [350];
          } else {
            chart_attributes['height'] = [200];
          }

          // Loop through all numbers to find the max
          var number_array = [];

          function pullOutNumbers(data) {
            _.each(data, function(val, key) {
              _.each(val, function(val_two, key_two) {
                var number = parseFloat(val_two);

                if (key_two !== 'rowNumber' && key_two !== 'quarter') {
                  if ( String(number) !== 'NaN') {
                    number_array.push(number);
                  }
                }
              });
            });
          // Close function
          }
          pullOutNumbers(val['elements']);
          
          // This allows both axises on the side-by-side charts to be the same
          // We need to find out the min and max of the chart next to the current one
          // To get the same x axis
          if (sheet_num == 5 || sheet_num == 10 || sheet_num == 13) {
            pullOutNumbers(tabletop_data[sheet_names[sheet_num + 1]]['elements']);
          } else if (sheet_num == 6 || sheet_num == 11 || sheet_num == 14) {
            pullOutNumbers(tabletop_data[sheet_names[sheet_num - 1]]['elements']);
          }

          var min = getMinOfArray(number_array);

          if (sheet_num == 5 || sheet_num == 6 || sheet_num == 8) {
            var max = Math.ceil(getMaxOfArray(number_array) / 100) * 100;
            
            if (sheet_num == 8) {
              chart_attributes['tick_format'] = 'percent'
              chart_attributes['width'] = $(window).width();
            } else {
              chart_attributes['tick_format'] = 'dollars'
            }
          // Charts with percent will always have a max domain of 100%
          } else {
            var max = 100;
            chart_attributes['tick_format'] = 'percent'
          }

          chart_attributes['yscale_domain'] = [min - 1, max];
          chart_attributes['chartable_values'] = ['amerigroup', 'amerihealth', 'unitedhealthcare'];

          if (sheet_num == 10 || sheet_num == 11 || sheet_num == 13 || sheet_num == 14) {
            chart_attributes['chartable_values'].push('requirement');
          }
        }

        // Create container where we will put SVG
        var svg_container = '<div id="svg-' + num + '-container" class="svg-container">';
        if (sheet_num == 5 || sheet_num == 6) {
          if (name.indexOf('Adult') > -1) {
            name = 'Adults'
          } else if (name.indexOf('Child') > -1) {
            name = 'Children'
          }
        }
        if (sheet_num != 8) {
          svg_container += '<h5>' + name + '</h5>';
        }
        svg_container += '<div id="tooltip-' + num + '" class="tooltip">Tipsy!</div>';
        svg_container += '</div>';

        // Append the container to the DOM
        $(charts_containers).append(svg_container);

        // Call model, which sets values
        // And calls view of new chart
        var chart_rendered = new ChartModel(chart_attributes);
      }

      // Call events after last data has been loaded
      if (sheet_names.length - 1 == sheet_num) {
        pymChild.sendHeight();
      }
    // Close each
    });
  // Close load Tabletop data
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    Tabletop.init({
      key: this.spreadsheet_key,
      callback: this.loadTabletopData,
      simpleSheet: false,
      debug: false
    });
  }
});

var appview = new AppView();