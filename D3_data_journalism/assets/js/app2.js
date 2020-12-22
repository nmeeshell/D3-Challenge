const svgHeight = 400
const svgWidth = 1000

const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  }

const chartHeight = svgHeight - margin.top - margin.bottom
const chartWidth = svgWidth - margin.left - margin.right

const svg = d3.select("body").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  
const chartG = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)


const update = (data, xAxisG, circles, selection) => {

  let selectionDataKey = selection === "Num Albums" ?  "obesity" : "poverty"

  const selectionData = data.map(d => parseInt(d[selectionDataKey]))

  const newXScale = d3.scaleLinear()
    .domain([0, d3.max(selectionData)])
    .range([0, chartWidth])
  
  const xAxis = d3.axisBottom(newXScale)

  xAxisG.transition()
    .duration(1000)
    .call(xAxis)

  circles.transition()
    .duration(1000)
    .attr("cx", d => newXScale(parseInt(d[selectionDataKey])))
}

d3.csv("D3_data_journalism/assets/data/data.csv").then(data => {
    console.log(data)
    console.log(d3.max(data.map(d => parseInt(d.poverty))))
    console.log(d3.max(data.map(d => parseInt(d.obesity))))

    const y = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => parseInt(d.age)))])
        .range([chartHeight, 0])

    const x = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => parseInt(d.obesity)))])
        .range([0, chartWidth])

    const yAxis = d3.axisLeft(y)
    const xAxis = d3.axisBottom(x)

    chartG.append("g")
        .call(yAxis)
    
    const xAxisG = chartG.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)
    
    const labelArea = svg
    .append("g")
    .attr(
      "transform",
      `translate(${svgWidth / 2}, ${svgHeight - margin.bottom + 30})`
    );
    
    labelArea
      .append("text")
      .attr("stroke", "#000000")
      .text("Poverty")

    labelArea
      .append("text")
      .attr("stroke", "#000000")
      .text("Obesity")
      .attr("dy", "16")

    labelArea.selectAll("text")
      .on("click", function() {
        const selection = d3.select(this).text()
        console.log(selection)
        // newXScale = xScale(data, selection)
        // renderXAxis(xAxisG, newXScale)
        // renderCircles(circles, newXScale, selection)
        update(data, xAxisG, circles, selection)
      })


    const circles = chartG.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => parseInt(x(d.obesity)))
            .attr("cy", d => parseInt(y(d.age)))
            .attr("r", 10)
})