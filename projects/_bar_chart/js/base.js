// FUNCTIONS
// Used to capitalize first letter of string
function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Used to capitalize first letter of all words
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        first_letter = txt.charAt(0).toUpperCase();

        // This captures words with an apostrophe as the second character
        // And capitalizes them correctly
        // Example: o'brien = O'Brien
        if (txt.charAt(1) === "'") {
            return first_letter + txt.charAt(1) + txt.charAt(2).toUpperCase() + txt.substr(3).toLowerCase();
        } else {
            return first_letter + txt.substr(1).toLowerCase();
        }
    });
}

// Add commas to numbers over 1000
function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

// This removes special characters and spaces
function removeSpecialCharacters(string) {
    return string.replace(/[^\w\s]/gi, '').replace(/ /g,'');
}

function chartWidthSet(chart, chart_width, num_charts) {
    var window_width = $(window.self).width();
    var window_height = $(window.self).height();
    
    // Autmatically sets the size of the chart
    // To the size of the iFrame
    chart.resize({
        width: chart_width
    });

    if ( window.self !== window.top ) {
        // Height of other elements next to chart
        var misc_heights = 0;
        var toggle_view_counted = false;
        var toggle_view_height = 0;

        // Loop through siblings of chart
        _.each($(chart.element).siblings(), function(value, num) {
            // If element is shown, add it up
            if ( $(value).is(":visible") ) {
                misc_heights += $(value).outerHeight();
            }

            if ( $(value).hasClass('toggle-view') ) {
                toggle_view_counted = true;
                toggle_view_height += $(value).outerHeight();
            }
        });

        // Fall back if we nest charts within other divs
        // And the toggle isn't a sibling
        if (toggle_view_counted === false) {
            misc_heights += $('.toggle-view').outerHeight();
            toggle_view_height += $('.toggle-view').outerHeight();
        }

        // New height of chart is height of window minus height of ther elements
        var new_chart_height = window_height - 10 - misc_heights;

        // Content is wrapped around al lthe content
        $('#content').height( window_height );

        // If we have one chart on the page or all the charts are on the same line
        // Set height of chart to window minus elements on page
        if (num_charts === 1 || Math.round(window_width / chart_width) === num_charts) {
            // Set size of iFrame if on mobile
            chart.resize({
                height: new_chart_height
            });
        // Otherwise make them just the height they take up
        // So if two charts are on two lines and the window minus elements is 200
        // Each chart would be 100
        } else {
            // How many lines of charts we have
            // Example four on one line
            // Becomes two on two lines on mobile
            var charts_lines = Math.round(window_width / chart_width);

            // When setting the height of charts where we have charts on multiple lines
            // We take in to consideration the side of the toggle options only one
            var toggle_view_height_lines = (charts_lines - 1) * toggle_view_height;

            chart.resize({
                height: (new_chart_height + 10) / num_charts + toggle_view_height_lines
            });
        }
    }
}

// Double check to see that the content inside iframe is the same height as window
$(window).ready(function() {
    if ( window.self !== window.top ) {
        $('#content').height( $(window.self).height() );
    }
});

// Resizes chart
function windowResize() {
    // There's one chart on the page
    if ( typeof(charts) === 'undefined') {
        chartWidthSet(chart, $(window.self).width(), 1 );
    } else if (charts.length < 1) {
        chartWidthSet(chart, $(window.self).width(), 1 );
    // There's more than one chart on the page
    } else if (charts.length > 0) {
        _.each(charts, function(value, index) {
            chartWidthSet(value, $(value['element']).width(), charts.length );
        })
    }
};

// iFrame resize
// $(window).resize(function() {
//     windowResize();
// });

// Used to save console output
// Used to pull data out of a Google spreadsheet
// And into a JSON file
(function(console){
    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)