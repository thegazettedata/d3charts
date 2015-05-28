$(function() {
	// Each column in the data we want to chart
	var chart_one_data = ['year'];

	var chart_one = new LineChartView({
		el: '#svg-one-container',
		csv: "data/medicare_medicaid.csv",
		chartable_columns: chart_one_data,
		padding: [20, 10, 55, 45],
		height: 200
	}).render();
});