function readJSON(path) { 
    var xhr = new XMLHttpRequest(); 
    xhr.open('GET', path, false); 
    xhr.send(null); 
    console.log(xhr.response)
    return JSON.parse(xhr.response)
} 

var json_data = readJSON("../../../resources/scraping_results/epoch_time_records.json");



var total_lectures = 0; 
var new_hash = {};
var today = new Date();
var min_date = today;
for (let [key, value] of Object.entries(json_data)) {
	var myDate = new Date( key *1000);
	if(myDate < min_date) {
		min_date = myDate;
	}
	new_hash[myDate] = value;
	total_lectures += value;
}

var key_arrs = [];
var value_arrs = [];
var imos_value_arrs = [];
var imos_val = 0;

var monthly_hash = {};


for (var d = min_date; d <= today; d.setDate(d.getDate() + 1)) {
	var value = 0;
	if(new_hash[d]) {
		value = new_hash[d];
	}
	imos_val += value;
    key_arrs.push(d.getFullYear() + "-" + ( d.getMonth() + 1 ) + "-" +d.getDate());
    if(monthly_hash[d.getFullYear() + "-" + ( d.getMonth() + 1 )]) {
		monthly_hash[d.getFullYear() + "-" + ( d.getMonth() + 1 )] += value;
	} else {
		monthly_hash[d.getFullYear() + "-" + ( d.getMonth() + 1 )] = value;
	}
    value_arrs.push(value);
    imos_value_arrs.push(imos_val);
}

console.log(key_arrs);
console.log(value_arrs);
console.log(imos_value_arrs);

var barChartData = {
    labels: key_arrs,
    datasets: [
    {
        type: 'line',
        label: 'Total number of lessons',
        data: imos_value_arrs,
        radius: 0.1,
        borderColor : "rgba(254,97,132,0.8)",
                pointBackgroundColor    : "rgba(254,97,132,0.8)",
                fill: false,
        yAxisID: "y-axis-1",// 追加
    },
    {
        type: 'bar',
        label: 'Number of Lessons',
        data: value_arrs,
        borderColor : "rgba(54,164,235,0.8)",
        backgroundColor : "rgba(54,164,235,0.5)",
        yAxisID: "y-axis-2",
    },
    ],
};

var complexChartOption = {
    responsive: true,
    scales: {
        yAxes: [{
            id: "y-axis-1",
            type: "linear", 
            position: "left",
            // ticks: {
            //     max: 0.2,
            //     min: 0,
            //     stepSize: 0.1
            // },
        }, {
            id: "y-axis-2",
            type: "linear", 
            position: "right",
            ticks: {
                min: 0
            },
            gridLines: {
                drawOnChartArea: false, 
            },
        }],
    }
};


var monthly_arr = []
var monthly_imos_arr = []
var imos_monthly_val = 0
for (let [key, value] of Object.entries(monthly_hash)) {
	monthly_arr.push(value);
	imos_monthly_val += value;
	monthly_imos_arr.push(imos_monthly_val);
}

var barChartDataMonthly = {
    labels: Object.keys(monthly_hash),
    datasets: [
    {
        type: 'line',
        label: 'Total number of lessons per month',
        data: monthly_imos_arr,
        radius: 0.1,
        borderColor : "rgba(254,97,132,0.8)",
                pointBackgroundColor    : "rgba(254,97,132,0.8)",
                fill: false,
        yAxisID: "y-axis-4",// 追加
    },
    {
        type: 'bar',
        label: 'Number of Lessons per month',
        data: monthly_arr,
        borderColor : "rgba(54,164,235,0.8)",
        backgroundColor : "rgba(54,164,235,0.5)",
        yAxisID: "y-axis-3",
    },
    ],
};

var montlyChartOption = {
    responsive: true,
    scales: {
        yAxes: [ {
            id: "y-axis-4",
            type: "linear", 
            position: "left",
            // ticks: {
            //     max: 0.2,
            //     min: 0,
            //     stepSize: 0.1
            // },
        }, {
            id: "y-axis-3",
            type: "linear", 
            position: "right",
            ticks: {
                min: 0
            },
            gridLines: {
                drawOnChartArea: false, 
            },
        }],
    }
};

window.onload = function() {
    ctx = document.getElementById("daily-progress-canvas").getContext("2d");
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: complexChartOption
    });
    ctx_montly_progress = document.getElementById("monthly-progress-canvas").getContext("2d");
    window.myBar = new Chart(ctx_montly_progress, {
        type: 'bar',
        data: barChartDataMonthly,
        options: montlyChartOption
    });
    window.document.getElementById('total-lectures').innerHTML = total_lectures;
    window.document.getElementById('total-hours').innerHTML = (total_lectures * 25.0 / 60.0).toFixed(2);
};