var svgContainer = null;
var gDebugMsg = null;
var dataFilesBaseURL=null;

var analysisFeaturesMenu =
{ "features" : [
      {"key": "1", "value":"overview"},
      {"key": "2", "value":"incomepoverty"},
      {"key": "3", "value":"racialdist"}
  ]};


var loc = window.location;
var hostname = loc.hostname;

if (hostname.includes("cheersayam.github")) {
   dataFilesBaseURL="https://raw.githubusercontent.com/cheersayam/dataviz_final_project/data/";
}
else {dataFilesBaseURL="http://127.0.0.1:8080/data/";}

var triggerSelected=null;
var travYear = 2015;
var filegeoJSONURL = "cb_2017_us_state_500k.geojson",
    filePopulationByState = "acs"+travYear+"_PopulationByState.csv",
    fileKeyStatsByState = "acs"+travYear+"_KeyStatsByState.csv",
    fileTotalPopulationByRegion = "acs"+travYear+"_TotalPopulationByRegion.csv",
    fileRacialDistributionPerRegion = "acs"+ travYear + "_RacialDistributionPerRegion.csv";


var filegeoJSONURL = dataFilesBaseURL + filegeoJSONURL,
    filePopulationByStateURL = dataFilesBaseURL + filePopulationByState,
    fileKeyStatsByStateURL = dataFilesBaseURL + fileKeyStatsByState,
    fileRacialDistributionPerRegionURL = dataFilesBaseURL + fileRacialDistributionPerRegion,
    fileTotalPopulationByRegionURL = dataFilesBaseURL + fileTotalPopulationByRegion;

console.log("File: filegeoJSONURL: " +  filegeoJSONURL);
console.log("File: filePopulationByStateURL: " +  filePopulationByStateURL);
console.log("File: fileKeyStatsByStateURL: " +  fileKeyStatsByStateURL);
console.log("File: fileRacialDistributionPerRegionURL: " +  fileRacialDistributionPerRegionURL);
console.log("File: fileTotalPopulationByRegionURL: " +  fileTotalPopulationByRegionURL);


// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50, slider: 60},
    gWidth = 960 - margin.left - margin.right,
    gHeight = 700 - margin.top - margin.bottom,
    canvasWidth = gWidth,
    canvasHeight = gHeight - margin.slider;


function slider(svgContainer) {
var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");

var startDate = new Date("2010-01-01"),
    endDate = new Date("2017-12-31");

var width = gWidth,
    height = gHeight;

var svg = svgContainer.select("#slider");
  /*  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height); */

var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width])
    .clamp(true);

var slider = svgContainer.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + (gHeight - margin.slider) + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDateIntoYear(d); });

var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")")

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

function hue(h) {
  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(formatDate(h));
  svg.style("background-color", d3.hsl(h/1000000000, 0.8, 0.8));
}

}


var mapColor = d3.scaleLinear()
                        //.range(['#ffffd4','#fee391','#fec44f','#fe9929','#d95f0e','#993404']);
                         .range(['#fef0d9','#fdcc8a','#fc8d59','#d7301f']);

function debugMsg(message) {
    gDebugMsg = "<br/>DEBUG: " + message;
    document.getElementById('debugMsg').innerHTML = gDebugMsg;
}

function isRealValue(obj) {
 return obj && obj !== 'null' && obj !== 'undefined';
}

function svgContainerInit() {
    //d3.select(".abtVizMsg").style("visibility", "hidden");
    svgContainer =  d3.select(".dispContainer").select("svg");
    svgContainer.attr("width", gWidth).attr("height", gHeight);
    svgContainer.selectAll("*").remove();
}

function updateView(featureToDisplay="", yearToDisplay=2015) {
  var travYear = yearToDisplay;

    svgContainerInit();
  var sequentialButtons = d3.select(".featuresButtons")
    .selectAll("button")
    .data(analysisFeaturesMenu.features)
    .enter().append("button")
    .text(function(d) { return d.key; })
    .on("click", function(buttonValue) {
        triggerSelected=buttonValue.value;
        console.log("triggerSelected: " + triggerSelected);
        switch (buttonValue.key) {
        case "1":
          overview(svgContainer);
          break;
        case "2":
          incomepoverty(svgContainer);
          break;
        case "3":
          racialdist(svgContainer);
          break;
        default:
          debugMsg("buttonKey is: " + buttonValue.key);
          break;
        }
      });

      if (!isRealValue(triggerSelected)) {
        debugMsg("Going to call displayAboutViz()");
        displayAboutVizBtn(svgContainer);
      }
}

function displayAboutVizBtn(svgContainer) {
  //d3.select(".abtVizMsg").style("visibility", "visible");

  var displayAboutBtn = d3.select(".abtVizMsg")
    .selectAll("button")
    .data(['About the Visualization'])
    .enter().append("button")
    .text(function(d) { return d; })
    .on("click", function(buttonValue) {
        displayAboutVizMessage();
    });
}

function displayAboutVizMessage() {
  debugMsg("Inside displayAboutVizMessage()");
  d3.select(".abtVizMsg").style("visibility", "visible");

/*
var aboutVizOverview = '
Using 2015 US Census data find out the sex ratio and citizen ratio across the country. Find the racial make up of various census regions. Find out which areas have highest overall and child poverty in relation to per capita income distribution.

 It contains 4 charts. In this visualization I am analyzing 2010 to 2015 US Census ACS. Only the contiguous states related data were used for analysis. These are the charts I have created:
(i) Population Overview
(iii) Income, Poverty & Unemployment
(iv) Racial Distribution Per Region


The first is  filled maps giving views with two different aspects captured in the data set. Population Overview filled map provides an overview of total population per state, women to men ratio.

Income, Poverty & Unemployment is  a scattered plot that captures the relation ship between per capita income and poverty in each US State.  This is a discrete quantitative vs continous quantitative plot. Circle is the shape used. The position of circle represents this relationshiop. The size of the circle represents another key indicator:  '% of child poverty'. The color of the circle represents percentage unemployment in each state.

Racial Distribution Per Region is a bar chart representing racial make up of population across 4 US census regions. It is plotted against regions and 6 racial groupings Vs the percentage population of each race, which is a continuous variable for this purpose.

';
*/

var rubricTextJSON =
{
  "rubric": [
      {"question": "Does the narrative visualization correctly follow the hybrid structure as stated by the essay?",
      "answer":"Yes. The narrative visualization correctly follows the hybrid structure stated in the essay. Yes. The narrative visualization correctly follows the hybrid structure stated in the essay.Yes. The narrative visualization correctly follows the hybrid structure stated in the essay"
      },
      {"question": "Does the narrative visualization effectively utilize scenes?",
      "answer":"Yes. The essay properly discusses the layout and design of the scenes of the narrative visualization."
      },
      {"question": "Does the narrative visualization effectively utilize annotations?",
      "answer":"Yes. The essay properly discusses the application of the annotations of the narrative visualization."
      },
      {"question": "Does the narrative visualization effectively utilize parameters?",
      "answer":"Yes. The essay properly discusses the parameters of the narrative visualization, including describing which parameters control the current state of the narrative visualization."
      },
      {"question": "Does the narrative visualization effectively utilize triggers?",
      "answer":"Yes. The essay properly discusses the triggers, including what user events trigger what parameter value changes, and how the viewer is aware of available user events."
      }
]
};

/*
var rubricTextJSON =
[
      {"text": "Does the narrative visualization correctly follow the hybrid structure as stated by the essay?"},
      {"text":"Yes. The narrative visualization correctly follows the hybrid structure stated in the essay."},
      {"text": "Does the narrative visualization effectively utilize scenes?"},
      {"text":"Yes. The essay properly discusses the layout and design of the scenes of the narrative visualization."},
      {"text": "Does the narrative visualization effectively utilize annotations?"},
      {"text":"Yes. The essay properly discusses the application of the annotations of the narrative visualization."},
      {"text": "Does the narrative visualization effectively utilize parameters?"},
      {"text": "Yes. The essay properly discusses the parameters of the narrative visualization, including describing which parameters control the current state of the narrative visualization."},
      {"text": "Does the narrative visualization effectively utilize triggers?"},
      {"text":"Yes. The essay properly discusses the triggers, including what user events trigger what parameter value changes, and how the viewer is aware of available user events."}
];

*/
    var columns = ["question", "answer"];

    var table = d3.select(".abtVizMsg").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");


thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });


    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(rubricTextJSON.rubric)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; });


          var displayAboutBtn = d3.select(".abtVizMsg")
    .selectAll("button")
    .data(['About the Visualization'])
    .enter().append("button")
    .text(function(d) { return d; })
    .on("click", function(buttonValue) {
        displayAboutVizMessage();
    });

/*
  d3.select(".abtVizMsg")
    .selectAll("button")
    .data(['Take me to the Visualization'])
    .enter().append("button")
    .text(function(d) { return d; })
    .on("click", updateView());
*/
/*
d3.select(".abtVizMsg")
    .selectAll("p")
    .data(rubricTextJSON.rubric)
    .enter()
    .append("p")
    .text(function(d){return [d.question d.answer]});
*/
}



function overview(svgContainer) {
var width = canvasWidth,
    height = canvasHeight;
//debugMsg("Inside Overview");


var mapColor = d3.scaleLinear()
                         .range(['#ffffd4','#fee391','#fec44f','#fe9929','#d95f0e','#993404']);


var projection = d3.geoAlbers()
                   .scale(width / 2 / Math.PI)
                   .scale(width)
                   .translate([width / 2, height / 2]);


var path = d3.geoPath()
             .projection(projection);

d3.csv(filePopulationByStateURL, function(data) {
    mapColor.domain ([
    d3.min(data,function(d) {return parseInt(d.TotalPop); }), d3.max(data,function(d) {return parseInt(d.TotalPop); })
     ]);

  d3.json(filegeoJSONURL, function(err, geojson) {

     for (var i=0; i < data.length ; i++) {
        var travGeo = data[i].State;
        var travTotalPop = parseInt(data[i].TotalPop);
        for (j=0; j < geojson.features.length; j++) {
          var geo = geojson.features[j].properties.NAME;
          if (travGeo == geo) {
              geojson.features[j].properties.value = travTotalPop;
              break;
          }
        }

     }

       svgContainer
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d){
          var value = d.properties.value;
          if (value) {
            return(mapColor(value))
          } else {
            return ("#666666")
          }
        });
    });

});
slider(svgContainer);
}



function incomepoverty(svgContainer) {

var width = gWidth,
    height = gHeight;

debugMsg("Inside IncomePoverty");

var xValue = function(d) { return d.IncomePerCap;},
    xScale = d3.scaleLinear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d));},
    //xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    xAxis = d3.axisBottom(xScale);


var yValue = function(d) { return d["Poverty"];},
    yScale = d3.scaleLinear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.axisLeft(yScale);

var cValue = function(d) { return d.Unemployment;},
    color = d3.scaleOrdinal(d3.schemeCategory10);


// Circle size (Represents Child Poverty)
var cirRadValue = function(d) { return d["ChildPoverty"];},
    cirRadScale = d3.scaleLinear().range([3.5, 3.5]),
    cirRadMap = function(d) { return cirRadScale(cirRadValue(d));};


var svg = svgContainer
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv(fileKeyStatsByStateURL, function(error, data) {

  data.forEach(function(d) {
    d.IncomePerCap = +d.IncomePerCap;
    d.Unemployment = +d.Unemployment;
    d.Poverty = +d.Poverty;
    d.ChildPoverty = +d.ChildPoverty;
//    console.log(d);
  });

  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  svgContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Income per Capita");

  svgContainer.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Poverty");

  // draw dots
  svgContainer.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", cirRadMap)
      //.attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["State"] + "<br/> (" + xValue(d)
	        + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // Legend
  var legend = svgContainer.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // Legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // Legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});
slider(svgContainer);
}


function racialdist(svgContainer) {
  var width = gWidth,
    height = gHeight;

    console.log("width: " + width  + " <end>");
    console.log("height: " + height  + " <end>");
    console.log("margin.top: " + margin.top  + " <end>");
    console.log("margin.bottom: " + margin.bottom  + " <end>");
    console.log("margin.left: " + margin.left  + " <end>");
    console.log("margin.right: " + margin.right  + " <end>");

    //gWidth = 700 - margin.left - margin.right,
    //gHeight = 200 - margin.top - margin.bottom,
    //width = 700 - margin.left - margin.right,
    //height = 100 - margin.top - margin.bottom;

//document.getElementById("debug2").innerHTML = "Racial Distribution";

var svgContainer = d3.select(".dispContainer").select("svg");
svgContainer .attr("width", width).attr("height", height);
svgContainer.selectAll("*").remove();

var totalPopArr=[];
var columns=null;
var regions=[];
var regionsTotalPop=[];
var categoriesNames = [];

d3.csv(fileTotalPopulationByRegionURL, function(error, regionData) {
regionData.map(function(d) {
  regions.push(d.Region);
  d.TotalPop = Number(d.TotalPop);
  console.log("d.TotalPop: " + d.TotalPop + " <end>");
  regionsTotalPop.push(d.TotalPop);
});

console.log("regions: " + regions + " <end>");
console.log("regionsTotalPop: " + regionsTotalPop + " <end>");

});

categoriesNames=regions;


var y = d3.scaleLog()
  //.domain([d3.min(regionsTotalPop), d3.max(regionsTotalPop)])
  .range([height, 0]);


console.log ("y log scale:" + y + ' <end>');

var x0 = d3.scaleOrdinal()
    .domain(categoriesNames)
    .range([margin.left, gWidth-margin.left]);

var x1 = d3.scaleOrdinal();


var xAxis = d3.axisBottom(x0).tickFormat(function(d){ return d;});
var yAxis = d3.axisLeft(y);


var color = d3.scaleOrdinal()
    .range(['#ffffd4','#fee391','#fec44f','#fe9929','#d95f0e','#993404']);

var svg = svgContainer
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//d3.json("data.json", function(error, data) {

var columns = null;
d3.csv(fileTotalPopulationByRegionURL , function(data) {

if(columns==null){
        var headerNames = d3.keys(data[0]);
        columns=headerNames.slice(1,7);
        console.log("columns: " + columns + " <end>");
  }

  data.forEach(function(d) {
    d.Hispanic = +d.Hispanic;
    d.Black = +d.Black;
    d.Native = +d.Native;
    d.Asian = +d.Asian;
    d.Pacific = +d.Pacific;
    //d.TotalPop = +d.TotalPop;
  });


//rateNames: Hispanic,White,Black,Native,Asian,Pacific
var rateNames = columns;
console.log("rateNames: " + rateNames + " <end>");


x0.domain(categoriesNames);
//x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
x1 = d3.scaleBand()
    .rangeRound([0, x0.bandwidth])
    .paddingInner(0.5);

/*y.domain([d3.min(data, function(d){ return d3.min([d.Hispanic,d.White,d.Black,d.Native,d.Asian,d.Pacific])}),
d3.max(data, function(d){ return d3.max([d.Hispanic,d.White,d.Black,d.Native,d.Asian,d.Pacific])})]);
*/

y.domain([d3.min(regionsTotalPop), d3.max(regionsTotalPop)])


console.log ("x0.domain: " + x0.domain());
console.log ("x1.domain: " + x1.domain());
console.log ("y.domain: " + y.domain())


  svgContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + gHeight + ")")
      .call(xAxis);

  svgContainer.append("g")
      .attr("class", "y axis")
      .style('opacity','0')
      .call(yAxis)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("Value");

  svgContainer.select('.y').transition().duration(500).delay(1300).style('opacity','1');

  var slice = svgContainer.selectAll(".slice")
      .data(regions)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d) { return "translate(" + x0(d) + ",0)"; });

  slice.selectAll("rect")
      .data(data, function(d) { return [d.Hispanic,d.White, d.Black,d.Native,d.Asian,d.Pacific]; })
  .enter().append("rect")
      .attr("width", x1.bandwidth())
      .attr("x", function(d,i) { return x1(rateNames[i]); })
      .style("fill", function(d,i) { return color(rateNames[i]) })
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return gHeight - y(0); })
      .on("mouseover", function(d,i) {
          d3.select(this).style("fill", d3.rgb(color(rateNames[i])).darker(2));
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d));
      });

  slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return height - y(d.value); });

  //Legend
  var legend = svgContainer.selectAll(".legend")
    .data(rateNames)

      //.data(data[0].values.map(function(d) { return d.rate; }).reverse())
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity","0");

  legend.append("rect")
      .attr("x", gWidth - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", gWidth - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

});
slider(svgContainer);
}
