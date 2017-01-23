var data = []; //Storage for our data

var margin = {top: 20, right: 30, bottom: 50, left: 50};
var Width = 907-margin.right-margin.left;
var Height = 500-margin.top-margin.bottom;

var tooltip = d3.select("body").append("div")
.attr("class","tooltip")
.style("opacity",0);

var xScale = d3.scaleBand().rangeRound([ 0, Width]).padding(0.1).align(0);
var xScale2 = d3.scaleBand().rangeRound([ 0, Width]).padding(0.1).align(0);

var yScale = d3.scaleLinear().rangeRound([Height,0]);

var xAxis = d3.axisBottom().scale(xScale);
var xAxis2 = d3.axisBottom().scale(xScale2);

var yAxis = d3.axisLeft().scale(yScale);

var drawDataChart = function() {
   
    svg = null;
    
    svg = d3.select(".chart")
      .append("svg")
      .attr("width",907)
      .attr("height",500)
      .append("g")
        .attr("transform","translate("+margin.left+","+margin.top+")");
    
    xScale.domain(data.map( (d) => { return d[0]; } ));
    xScale2.domain(data.filter((d,i)=>{ if(i%10==0){ return true; } return false; }).map( (d) => { return d[0].substr(0,4); } ));
    yScale.domain([ 0, d3.max(data,(d)=>{ return d[1]; })]);
    
	svg.selectAll("rect")
	.data(data)
	.enter() 
	  .append("rect")
	    .attr("class","bar")
	    .attr("fill","#000")
	    .attr("height",0)
	    .attr("y",Height)
	    .attr("x",(d)=>{ return xScale(d[0]); } )
	    .attr("width", xScale.bandwidth() )
	    .on("mouseover",(d)=>{
	        tooltip.transition().duration(400).style("opacity",0.9)
	        tooltip.html(d[0]+"<br/>"+d[1]+" billion").style("left", (d3.event.pageX) + "px")		
	        .style("top", (d3.event.pageY - 28) + "px");	
	    })
	    .on("mouseout",(d)=>{ tooltip.transition().duration(600).style("opacity",0); })
	    .transition()
        	.duration(200)
            .delay((d,i)=>{ return i*10; })
            	.attr("fill",(d,i)=>{ if(i%2){ return "#7777BB"; } return "#9999FF"; })
                .attr("y",(d)=>{ return yScale(d[1]); } )
                .attr("height", (d)=>{ return Height-yScale(d[1]); } ) ;

	svg.append("g")
	  .attr("class","x axis")
	  .attr("transform","translate(0,"+Height+")")
	  .call(xAxis2)
	    .selectAll("text")
	    .attr("dx","0.5em")
	    .attr("dy","-0.3em")
	    .attr("transform","rotate(90)") 
	    .style("font-size","14px")
	    .attr("text-anchor","start");

	svg.append("g")
	  .attr("class","y axis")
	  .call(yAxis);

	svg.append("text")
	    .attr("transform", "rotate(90)")
	    .attr("y", -15)
	    .attr("x", 10)
	    .attr("dy", ".71em")
	    .style("text-anchor", "start")
	    .style("font-size","20px")
	    .text("GDP in Billions");
}

$.get("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", (d) => { 
	data = JSON.parse(d).data;  
    drawDataChart();
});

