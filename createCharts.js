function createTable(data, company, augments) {
   	var header = ['Company', 'Sales'];
	if (augments) {
    		header.push('Marketshare');
	}
 
    	var table = d3.select("#visualization").append("table");
    	var thead = table.append("thead");
   	var tbody = table.append("tbody");

    	// Append the header row
    	thead.append('tr')
        	.selectAll('th')
        	.data(header)
        	.enter()
        	.append('th')
        	.text(function (column) { return column; });

    	// Create a row for each object in the data
    	var rows = tbody.selectAll('tr')
        	.data(data)
        	.enter()
        	.append('tr');

	var cells = rows.selectAll('td')
    		.data(function (row) {
        		return header.map(function (column) {
            			return { column: column, value: row[column] };
        		});
    		})
    		.enter()
    		.append('td')
    		.text(function (d) {
        		// Check if the column is 'Marketshare' and format the value accordingly
        		if (d.column === 'Marketshare') {
            			return d.value + '%';
        		} else {
            			return d.value;
        		}
    		});

	if (augments) {
    		// Calculate and fill in the percent of the total values
    		rows.each(function (row, rowIndex) {
        		var total = parseFloat(row['Sales']) || 0;

        		var percent = Math.round((total / data.reduce(function (acc, curr) {
            			return acc + parseFloat(curr['Sales']) || 0;
        		}, 0) * 100));

        		d3.select(this).select('td:last-child').text(percent + '%');
    		});
	}
    	
	const position = data.findIndex(item => item.Company === company);
    	document.getElementsByTagName('tr')[position + 1].style.backgroundColor = "#CBE896";
}

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

function createBar(data, company, augments, fontSize = "12pt") {
    	const margin = { top: 20, right: 70, bottom: 70, left: 60 };
    	const width = localStorage.getItem("width") * 1.1;
    	const height = localStorage.getItem("height") * 1.5;
	
	const svg = d3
        	.select("#visualization")
        	.append("svg")
        	.attr("width", width + margin.left + margin.right)
        	.attr("height", height + margin.top + margin.bottom)
        	.append("g")
        	.attr("transform", `translate(${margin.left},${margin.top})`);

    	const x = d3
        	.scaleBand()
        	.range([0, width])
        	.domain(data.map((d) => d.Company))
        	.padding(0.2);

    	svg.append("g")
        	.attr("transform", `translate(0, ${height})`)
        	.call(d3.axisBottom(x))
        	.selectAll("text")
        	.style("text-anchor", "middle")
        	.style("font-size", fontSize);

    	const maxY1 = d3.max(data, (d) => d.Sales);
    	const maxY2 = d3.sum(data, (d) => d.Sales);

    	const y1 = d3.scaleLinear().domain([0, maxY2]).range([height, 0]);
    	svg.append("g").call(d3.axisLeft(y1).ticks(6)).selectAll("text").style("font-size", fontSize);
	
	if (augments) {
    		const y2 = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    		svg.append("g")
        		.attr("transform", `translate(${width}, 0)`)
        		.call(d3.axisRight(y2)
        	    		.ticks(5)
        	    		.tickValues([0, .25, .50, .75, 1.0])
        	    		.tickFormat(d3.format(".0%"))
        		)
        		.selectAll("text")
        		.style("font-size", fontSize);
	}

    	svg.selectAll("mybar")
        	.data(data)
        	.join("rect")
        	.attr("x", (d) => x(d.Company))
        	.attr("y", (d) => y1(d.Sales))
        	.attr("width", x.bandwidth())
        	.attr("height", (d) => height - y1(d.Sales))
        	.attr("fill", "#fff")
        	.attr("stroke", "black")
        	.style("stroke-width", "1px");

    	svg.append("text")
        	.attr("transform", "rotate(-90)")
        	.attr("y", 0 - margin.left)
        	.attr("x", 0 - height / 2)
        	.attr("dy", "1em")
        	.style("text-anchor", "middle")
        	.style("font-size", fontSize)
        	.text("Sales");
	
	if (augments) {
    		svg.append("text")
        		.attr("transform", `translate(${width + margin.right}, ${height / 2}) rotate(90)`)
        		.attr("dy", "1em")
        		.style("text-anchor", "middle")
        		.style("font-size", fontSize)
        		.text("Marketshare");
	}

    	svg.append("text")
        	.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        	.style("text-anchor", "middle")
        	.style("font-size", fontSize)
        	.text("Company");

    	const position = data.findIndex((item) => item.Company === company);
    	document.getElementsByTagName("rect")[position].style.fill = "#CBE896";

}
