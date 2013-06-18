AutoGraph.graphs.scatterplot = {
	
	init:function(data){
		console.log(data)
		
		//Define a new plot
		var plot = new Scatterplot(data);
		
		for(var item in plot.series){
				plot.loadCSV(plot.series[item]);
			}
		
		
		
		//Return the plot to be stored for later use/reference
		return plot;
	},
	
}

function Scatterplot(data){
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
		
	return this;
}

Scatterplot.prototype.loadCSV = function(index, directory){
	var that = this;
	d3.csv(index.directory + index.csvfilename, function(data){
			console.log(data);
			//Individual Series Data
			index.data = data;
			
			index.complete = true;
			console.log(index)
			//Plot Data
			for(var x=0;x<data.length;x++){
				that.dataset.push(data[x]);
				that.yPool.push(data[x][index.ycolumn])
			}
			
			console.log(that.yPool)
			
			var completed_data = 0;
			for(var i = 0;i<that.series.length;i++){
				if(that.series[i].complete){
					completed_data++;
				}
				if(completed_data >= that.series.length){
					console.log("All Data Has Been Loaded")
					that.initGraph(function(){
						for(var set in that.series){
							that.addPoints(that.series[set], function(){
								
							})
						}
					});
				}
			}
			
		})
}

Scatterplot.prototype.addPoints = function(series, db){
	var that = this;
	console.log(series);
	this.svg.append('g')
		.attr("class", "points")
		.selectAll("circle")
			.data(series.data)
			.enter()
			.append("circle") //Change shape here
			.attr("class", "circle")
			.attr('data', function(d){
				return d["year"] + ", " + d[series.ycolumn];
			})
			.attr("series", series.serieslab)
			.attr({
				cx: function(d){
					var num = Number(d["year"]);

					return that.xScale(num);
				},
				cy: function(d){
					var num = (Number(d[series.ycolumn]))
					return that.yScale(num);
				},
				r: function(d){
					return 5;
				},
				fill:series.color
			})	
}

Scatterplot.prototype.initSeriesToggle = function(){	
	var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
	$(foreignObject).attr("x", this.w - this.padding * 3).attr("y", 20).attr("width", 100).attr("height", 100);
	$(foreignObject).append("<div class='toggle'></div>")
	this.toggle = $(foreignObject).find('.toggle');
	this.svg[0][0].appendChild(foreignObject);
}

Scatterplot.prototype.initGraph = function(cb){
	
	var that = this;
	console.log(this);
	this.xScale = d3.scale.linear()
					.domain([d3.min(this.dataset, function(d){return d['year']}), d3.max(this.dataset, function(d){return d['year']})])
					.range([this.padding, this.w - this.padding * 2.2]);
	this.yScale = d3.scale.linear()
					.domain([d3.min(this.yPool, function(d){return Number(d)}), d3.max(this.yPool, function(d){return Number(d) })])
					.range([this.h - this.padding, this.padding])
					

	
	//Add Axes
	var xAxis = d3.svg.axis();
		xAxis.scale(this.xScale);
		xAxis.orient("bottom");
		xAxis.ticks(this.xTicks);
		xAxis.tickFormat(d3.format("04d"));
		
	var yAxis = d3.svg.axis();
		yAxis.scale(this.yScale);
		yAxis.orient("left");
		yAxis.ticks(this.yTicks);
		
	this.svg = d3.select("body")
		.append("svg")
		.attr("width", this.w)
		.attr("height", this.h);
	
	this.svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + (this.h-this.padding) + ")")
		.call(xAxis);
		
	this.svgAxis = this.svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + (this.padding) +" , 0)")
		.call(yAxis)
		.selectAll("line")
		.attr("x2", this.w - this.padding * 3)
	
	//X LABEL
	this.svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", 'middle')
		.attr('x', this.w/2)
		.attr('y', this.h - 10)
		.text(function(){
			return that.xLabel
		})
	
	//Y LABEL
	this.svg.append("text")
		.attr('class', 'y label')
		.attr('text-achor', 'middle')
		.attr({
			y:6,
			x:-this.h/2,
			dy:'.75em',
			transform:'rotate(-90)'
		})
		.text(function(){
			return that.yLabel;
		})	
		
	this.svg.append("text")
		.attr('class', 'title')
		.attr('text-anchor', 'middle')
		.attr("y", 6)
	    .attr("x", this.w/2)
	    .attr("dy", ".75em")
		.text(function(){
			if(that.title.length > 40){
				that.title = that.title.split(" ");
				that.title[Math.round(that.title.length/2)] += "</br>"
				that.title = String(that.title).replace(/[ ,]+/g, " ");
			}
			console.log(that.title)
			return that.title
		 });
		 
	this.initSeriesToggle();
	cb();
}












