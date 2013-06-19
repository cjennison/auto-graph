AutoGraph.graphs.histogram = {
	init:function(data){
		console.log(data)
		
		//Define a new plot
		var chart = new Histogram(data);
		
		var id = Math.round(Math.random()*1000);
		var divContainer = $("<div id='container" + id + "'></div>")
		$("body").append(divContainer);
		chart.container = divContainer;
		chart.id = id;
		
		
		for(var item in chart.series){
				chart.loadCSV(chart.series[item]);
			}
		
		console.log(chart);		
		//Return the plot to be stored for later use/reference
		return chart;
	},
}
function Histogram(data){
		console.log(data)
		this.graphType = data.graphType;
		this.series = data.series;
		this.title = data.title;
		this.xLabel = data.xlab;
		this.yLabel = data.ylab;
		this.xTicks = data.xtick_interval;
		this.yTicks = data.ytick_interval;
		this.ycolumn_min = data.ycolumn_min;
		this.ycolumn_max = data.ycolumn_max;
		this.w = data.width;
		this.h = data.height;
		this.padding = data.padding;
		this.xScale = null;
		this.yScale = null;
		this.svg = null;
		this.dataset = [];
		this.yPool = [];
		this.xPool = [];
		
	return this;
}

Histogram.prototype.loadCSV = function(index, directory){
	var that = this;
	d3.csv(index.directory + index.csvfilename, function(data){
		index.data = data;
		
		
		index.self_data = [];
		for(var i=0;i<data.length;i++){
			var obj = {};
			obj.x = data[i][index.xcolumn];
			obj.y = Number(data[i][index.ycolumn]);
			index.self_data.push(obj);
		}
		
		index.enabled = true;
		index.complete = true;
		console.log(index);
		
		
	})
}
