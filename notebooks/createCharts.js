function createPie(formatData, company, augments) {
        var position = formatData.findIndex(item => item.Company === company);
        var colorList = Array(7).fill('#fff').map((c, i) => (i === position ? '#CBE896' : c));
        const data = Object.fromEntries(formatData.map(x => [x.Company, x.Sales]));

        const width = localStorage.getItem("width")*1.5;
        const height = localStorage.getItem("height")*1.5;
        const margin = 10;
        const radius = Math.min(width, height) / 2 - margin;

        const svg = d3.select("#visualization")
                .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                .append("g")
                        .attr("transform", `translate(${width/2}, ${height/2})`);

        const pie = d3.pie().value(function(d) {return d[1]})
        pie.sort(function(a, b) {
                return 0; // No sorting, maintaining the original order
        });
        var data_ready = pie(Object.entries(data))

        // shape helper to build arcs:
        const arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius)

        svg.selectAll('mySlices')
                .data(data_ready)
                .join('path')
                        .attr('d', arcGenerator)
                        .attr('fill', function(d, i){ return(colorList[i]); })
                        .attr("stroke", "black")
                        .style("stroke-width", "1px")

        var newarc = d3.arc()
                .innerRadius(0.8*radius)
                .outerRadius(radius);

        svg.selectAll('mySlices')
                .data(data_ready)
                .join('text')
                        .text(function(d) {
                                if (d.value != 0) {
                                        return d.data[0];
                                }})
                        .attr("transform", function(d) { return `translate(${newarc.centroid(d)})`})
                        .style("text-anchor", "middle")
                        .style("font-size", "12pt");
}


function createStackBar (data, company, augments) {
        const height = localStorage.getItem("height")/2;
        const width = localStorage.getItem("width")*2;
        const barHeight = 50;
        const halfBarHeight = barHeight / 2;
        const f = d3.format('.1f');
        const margin = {top: 0, right: 10, bottom: 20, left: 10};
        const w = width - margin.left - margin.right;
        const h = height * 0.66;
        const position = data.findIndex(item => item.Company === company);
        const colors = Array(7).fill('#fff').map((c, i) => (i === position ? '#CBE896' : c));
        const total = d3.sum(data, d => d.Sales);

        function groupDataFunc(data) {
                // use a scale to get percentage values
                const percent = d3.scaleLinear()
                        .domain([0, total])
                        .range([0, 100]);
                let cumulative = 0;
                const _data = data.map(d => {
                        cumulative += d.Sales
                        return {
                                Sales: d.Sales,
                                cumulative: cumulative - d.Sales,
                                label: d.Company,
                                percent: percent(d.Sales)
                        }
                })
                return _data;
        };

        const groupData = groupDataFunc(data);

        const svg = d3.select("#visualization")
                .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // set up scales for horizontal placement
        const xScale = d3.scaleLinear()
                .domain([0, total])
                .range([0, w]);

        const join = svg.selectAll('g')
                .data(groupData)
                .join('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // stack rect for each data value
        join.append('rect')
                .attr('class', 'rect-stacked')
                .attr('x', d => xScale(d.cumulative))
                .attr('y', h / 2 - halfBarHeight)
                .attr('height', barHeight)
                .attr('width', d => xScale(d.Sales))
                .style('fill', (d, i) => colors[i])
                .attr("stroke", "black")
                .style("stroke-width", "1px");

        join.append('text')
                .attr('class', 'text-value')
                .attr('text-anchor', 'middle')
                .attr('x', d => xScale(d.cumulative) + (xScale(d.Sales) / 2))
                .attr('y', (h / 2) + 5)
                .text(function(d) { 
			if (d.Sales != 0) {
                                return d.label;
                        }
                });
	if (augments) {
        	// Add markers at 0%, 25%, 50%, and 100%
        	const markerPositions = [0, 25, 50, 75, 100];

        	markerPositions.forEach((position) => {
                	const markerX = margin.left + xScale((position / 100) * total);

                	// Add a vertical line for the marker
                	svg.append("line")
                        	.attr("class", "marker-line")
                        	.attr("x1", markerX)
                        	.attr("x2", markerX)
                        	.attr("y1", h - margin.bottom - 1.5)
                        	.attr("y2", h)
                        	.style("stroke", "black")
                        	.style("stroke-width", "1px");

                	// Add a text label for the marker
                	svg.append("text")
                        	.attr("class", "marker-label")
                        	.attr("x", markerX)
                        	.attr("y", h + 15)
                        	.attr("text-anchor", "middle")
                        	.text(`${position}%`);
        	});
	}
}
