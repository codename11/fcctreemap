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

    let platforms = [];
    data.games.children.forEach((item, i) => {
        platforms.push(item.name);
    });

    let m = {top: 60, right: 30, bottom: 60, left: 30};
    let w = 1152;
    let h = 648;

    let svg = d3.select("#demo")
    .append("svg")
    .attr("width", w )
    .attr("height", h )
    .append("g")
    .attr("transform", "translate(" + m.left + "," + m.top + ")");

    let root = d3.hierarchy(data.games).sum((d) => { 
        return d.value;
    });

    d3.treemap()
        .size([w, h])
        .paddingInner(2)(root)
    
    const random_hex_color_code = () => {
        let n = (Math.random() * 0xfffff * 1000000).toString(16);
        return '#' + n.slice(0, 6);
    };

    let c1 = [];
    platforms.forEach((item, i) => {
        c1.push(random_hex_color_code());
    });
    
    console.log(platforms.length,c1.length);
    let color = d3.scaleOrdinal()
        .domain(platforms.join(" "))
        .range(c1);

    //Creating tooltip element.
    let tooltip = d3.select('#demo')
    .append('div')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip')
    .style('opacity', 0);

    let opacity = d3.scaleLinear()
        .domain([10, 30])
        .range([0.5,1]) 

    let g1 = svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("g");

        g1.append("text")
        .attr("font-size", "0.5em")
        .attr("x", (d,i) => {
            return d.x0; 
        })
        .attr("y", (d,i) => {
            return d.y0+10; 
        })
        .text((d,i)=>{
            return d.data.name;
        });
        
    g1.append("rect")
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

            return color(d.data.category);

        })
        .style("opacity", (d) => { 

            return opacity(d.data.value);

        })
        .on('mouseover', (d, i) => {

            tooltip.style("left", (d3.event.pageX + 10) + "px");
            tooltip.style("top", (d3.event.pageY - 28) + "px");
            tooltip.attr("data-value", d.data.value);
            tooltip.style('opacity', 0.5);
            tooltip.html("<div>Name: "+d.data.name+"</div><div>Category: "+d.data.category+"</div><div>Value: "+d.data.value+"</div>");

        })
        .on('mouseout', (d) => {
            tooltip.style('opacity', 0);
        });
        
        let m1 = {top: 60, right: 30, bottom: 60, left: 30};
        let w1 = 500;

        //Creating legend element.
        let legend = d3.select("#demo")
        .append("svg")
        .attr("width", w1)
        .attr("id", "legend")
        .append("g")
        .attr("transform", "translate(60, 10)");

        let lBlock = 15;
        let lHSpaceing = 150;
        let lVSpaceing = 10;
        let lX = 3;
        let lY = -2;
        let legendElemsPerRow = Math.floor(w1/lHSpaceing);

        legend.selectAll("rect")
            .data(platforms)
            .enter()
            .append("g")
            .attr("transform", (d, i) => {
                
                return "translate(" + ((i%legendElemsPerRow)*lHSpaceing) + "," + ((Math.floor(i/legendElemsPerRow))*lBlock + (lVSpaceing*(Math.floor(i/legendElemsPerRow)))) + ")";

            })
            .append("rect")
            .attr("class", "legend-item")
            .attr("width", lBlock)
            .attr("height", lBlock)
            .attr("fill", (d, i) => {
                return c1[i];
            });

        legend.selectAll("g")
            .append("text")
            .attr('x', lBlock + lX)                          
            .attr('y', lBlock + lY)  
            .text((d,i) => {
                return d;
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

//console.log(getData("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json", {}));
