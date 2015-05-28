$(function() {
	// Each column in the data we want to chart
	var chart_one_data = ['pop_17_under','pop_18_34','pop_35_54','pop_55_64','pop_65_older'];

	var chart_one = new BarChartView({
		el: '#svg-one-container',
		csv: "data/rural_urban.csv",
		chartable_columns: chart_one_data,
		padding: [20, 15, 0, 55],
		height: 60
	}).render();
});