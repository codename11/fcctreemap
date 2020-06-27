let kickstarter = getData("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json", {});
let movies = getData("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json", {});
let games = getData("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json", {});
let myData = async() => {

    let data = {
        kickstarter: await kickstarter,
        movies: await movies,
        games: await games,
    };
    
    return data;

};

myData().then((data)=>{ 
    console.log(data.games); 

    let m = {top: 10, right: 10, bottom: 10, left: 10};
    let w = 640;
    let h = 480;

    let svg = d3.select("#demo")
    .append("svg")
    .attr("width", w + m.left*2)
    .attr("height", h + m.top*2)
    .append("g")
    .attr("transform", "translate(" + m.left + "," + m.top + ")");

    let root = d3.hierarchy(data.games).sum((d) => { 
        return d.value;
    });

    d3.treemap()
        .size([w, h])
        .paddingInner(2)(root)

    let color = d3.scaleOrdinal()
        .domain(["Video Game Sales Data Top 100"])
        .range([ "#402D54", "#D18975", "#8FD175", "darkorange", "navy", "aqua"])

    //Creating tooltip element.
    let tooltip = d3.select('#demo')
    .append('div')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip')
    .style('opacity', 0);

    let opacity = d3.scaleLinear()
        .domain([10, 30])
        .range([0.5,1]) 

    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("data-name", (d, i) => {

            return d.data.name;

        })
        .attr("data-category", (d, i) => {

            return d.data.category;

        })
        .attr("data-value", (d, i) => {

            return d.data.value;

        })
        .attr('x', (d) => { 
            
            return d.x0; 

        })
        .attr('y', (d) => { 

            return d.y0; 

        })
        .attr('width', (d) => { 

            return d.x1 - d.x0; 

        })
        .attr('height', (d) => { 

            return d.y1 - d.y0; 

        })
        .style("stroke", "black")
        .style("fill", (d)  => { 
            console.log(d);
            return color(d.data.category);

        })
        .style("opacity", (d) => { 

            return opacity(d.data.value);

        })
        .on('mouseover', (d, i) => {
            //console.log(d);
            //console.log(d.data.value);
            tooltip.style("left", (d3.event.pageX + 10) + "px");
            tooltip.style("top", (d3.event.pageY - 28) + "px");
            tooltip.attr("data-value", d.data.value);
            tooltip.style('opacity', 0.5);
            tooltip.html("<div>Name: "+d.data.name+"</div><div>Category: "+d.data.category+"</div><div>Value: "+d.data.value+"</div>");

        })
        .on('mouseout', (d) => {
            tooltip.style('opacity', 0);
        });


});

async function getData(url = '', data = {}) {
	  
    let result = await fetch(url)
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
    }); 
    
    return result;

}

console.log(getData("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json", {}));
