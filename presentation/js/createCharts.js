const linewidth = 0.8

const grey = "#959595"
const green = "#17cfb0"
const orange = "#e78b23"
const white = "#FFFFFF"

const markerLen = 10;

// returns white except where highlighted at index
const highlight = (i, index, color) => (i === index ? color : white);

function createPie(data, highlightIndex, size, container) {
	const margin = 5;
	const radius = (size / 2) - margin;

	const svg = d3.select(container)
		.append("svg")
		.attr("width", size)
		.attr("height", size)
		.attr("viewBox", `${-size / 2} ${-size / 2} ${size} ${size}`);

	const pie = d3.pie()
		.sort(null)
		.startAngle(0)
		.endAngle(2 * Math.PI);

	const arc = d3.arc().innerRadius(0).outerRadius(radius);

	// Initial pie data
	const pieData = pie(data);

	const path = svg.selectAll("path")
		.data(pieData)
		.join("path")
		.attr("d", arc)
		.attr("fill", (d, i) => highlight(i, highlightIndex, green))
		.attr("stroke", grey)
		.attr("stroke-width", linewidth)
		.each(function(d) {
			// Store the initial angles for transition reference
			this._current = d;
		});

	// Draw markers
	const rOuter = radius + markerLen/2;
	const rInner = radius - markerLen/2;
	const markerPositions = [0, 25, 50, 75];
	markerPositions.forEach(pct => {
		const angle = (pct / 100) * 2 * Math.PI;
		svg.append("line")
			.attr("x1", rInner * Math.cos(angle))
			.attr("y1", rInner * Math.sin(angle))
			.attr("x2", rOuter * Math.cos(angle))
			.attr("y2", rOuter * Math.sin(angle))
			.attr("stroke", grey)
			.attr("stroke-width", linewidth);
	});

	// Return update function with proper interpolation
	return function update(newData, duration) {
		const newPieData = pie(newData);
		path.data(newPieData)
			.transition()
			.duration(duration)
			.attrTween("d", function(d) {
				const interpolator = d3.interpolate(this._current, d);
				this._current = interpolator(1); // update _current
				return function(t) {
					return arc(interpolator(t));
				};
			})
			.attr("fill", (d, i) => highlight(i, highlightIndex, green)); // re-evaluate fill in case highlight changes
	};
}

function createBar(data, highlightIndex, size, container) {
  const margin = 8;
  const width = size;
  const height = size / 10;
  const wInner = width - 2 * margin;
  const hInner = height - 2 * margin;

  const total = d3.sum(data);

  // compute initial stacked layout (x, width) in pixels
  let cum = 0;
  const stacked = data.map((v, i) => {
    const x = (cum / total) * wInner;            // start position (px)
    cum += v;
    const w = (v / total) * wInner;              // bar width (px)
    return { value: v, x, w, idx: i };
  });

  const svg = d3.select(container)
    .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

  // bars
  const rects = svg.selectAll("rect.rect-stacked")
    .data(stacked, d => d.idx)
    .join("rect")
      .attr("class", "rect-stacked")
      .attr("x", d => d.x + margin)
      .attr("y", margin)
      .attr("height", hInner)
      .attr("width", d => d.w)
      .attr("fill", d => highlight(d.idx, highlightIndex, orange))
      .attr("stroke", grey)
      .attr("stroke-width", linewidth)
      .each(function(d){
        // cache current geom for tweening
        this._x = d.x + margin;
        this._w = d.w;
      });

  // markers centered under the bar (0–100%)
  [0, 25, 50, 75, 100].forEach(pct => {
    const x = margin + (pct / 100) * wInner;
    svg.append("line")
      .attr("x1", x).attr("x2", x)
      .attr("y1", hInner - markerLen/2 + margin)
      .attr("y2", hInner + markerLen/2 + margin)
      .attr("stroke", grey)
      .attr("stroke-width", linewidth);
  });

  // --- helpers used by the returned updater(s) ---

  function layout(newData) {
    const T = d3.sum(newData);
    let c = 0;
    return newData.map((v, i) => {
      const x = (c / T) * wInner;
      c += v;
      const w = (v / T) * wInner;
      return { value: v, x, w, idx: i };
    });
  }

  function applyFill(sel) {
    sel.attr("fill", d => highlight(d.idx, highlightIndex, orange));
  }

  // --- return update functions ---

  // Animate to a new dataset
  function update(newData, duration) {
    const stackedNew = layout(newData);

    rects
      .data(stackedNew, d => d.idx)
      .transition()
      .duration(duration)
      .attrTween("x", function(d){
        const i = d3.interpolateNumber(this._x, d.x + margin);
        return t => (this._x = i(t));
      })
      .attrTween("width", function(d){
        const i = d3.interpolateNumber(this._w, d.w);
        return t => (this._w = i(t));
      })
      .call(applyFill); // re-evaluate highlight color
  }

  // Optionally change which segment is highlighted (no geometry change)
  update.setHighlight = function(newIndex){
    highlightIndex = newIndex;
    rects.call(applyFill);
  };

  return update;
}
