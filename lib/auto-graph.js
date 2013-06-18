var AutoGraph = {
	graphs:{},
	activeGraphs:[],
	
	initialize:function(url, domainurl){
		console.log(domainurl)
		
		var config = d3.json(url, function(data){
			console.log(data);
			AutoGraph.parseGraphs(data);
		})
		
		
		
	},
	
	parseGraphs:function(data){
		var graphTypes = data.graphTypes;
		for(graph in graphTypes){
			//console.log(graphClass);
			console.log(graphTypes[graph].graphClass);
			
			
			console.log(AutoGraph.graphs);
			var newgraph = AutoGraph.graphs[graphTypes[graph].graphClass].init(graphTypes[graph]);
			AutoGraph.activeGraphs.push(newgraph);
		}
		
		console.log(AutoGraph.activeGraphs)
	},
	
}
