var cal = new CalHeatMap();
var now = new Date();
cal.init({
	itemSelector: '#cal-heatmap',
	domain: "month",
	domainLabelFormat: '%Y-%m',
	data: "resources/scraping_results/epoch_time_records.json",
	start: new Date(now.getFullYear(), now.getMonth() - 11),
	previousSelector: "#example-c-PreviousDomain-selector",
	nextSelector: "#example-c-NextDomain-selector",
	cellSize: 15,
	range: 12,
	legend: [1, 3, 5, 7],
	tooltip: true
});