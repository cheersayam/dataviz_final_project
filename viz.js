var svgContainer = null;
var gDebugMsg = null;
var dataFilesBaseURL=null;

var sliderCircleX = 0;
var sliderCircleY = 0;

var travYear = "";

var analysisFeaturesMenu =
{ "features" : [
      {"key": "1", "value":"overview"},
      {"key": "2", "value":"incomepoverty"},
      {"key": "3", "value":"racialdist"}
  ]};


  var abtVizMsgMenu =
  { "features" : [
        {"key": "11", "value":"About this visualization"}
  ]};
/*
var loc = window.location;
var hostname = loc.hostname;

if (hostname.includes("cheersayam.github")) {
   dataFilesBaseURL="https://raw.githubusercontent.com/cheersayam/dataviz_final_project/data/";
}
else {dataFilesBaseURL="http://127.0.0.1:8080/data/";}

*/

dataFilesBaseURL = "./data/";
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

/*
var margin = {top: 30, right: 20, bottom: 30, left: 50, slider: 60},
    gWidth = 960 - margin.left - margin.right,
    gHeight = 700 - margin.top - margin.bottom,
    canvasWidth = gWidth,
    canvasHeight = gHeight - margin.slider;
*/


    var margin = {top: 30, right: 20, bottom: 30, left: 50, slider: 60},
    gWidth = 960 - margin.left - margin.right,
    gHeight = 700 - margin.top - margin.bottom -  - margin.slider;
    canvasWidth = gWidth,
    canvasHeight = gHeight;



//function slider(svgContainer) {

function slider() {
sliderSVG = d3.select(".slider").select("svg");
sliderSVG.attr("width", gWidth).attr("height", margin.slider);


var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");

var startDate = new Date("2010-01-01"),
    endDate = new Date("2015-12-31");

var width = gWidth,
    height = gHeight - margin.slider;

//var svg = svgContainer.select("#slider");

var svg = sliderSVG.select("#slider");

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
        .on("start drag", function() {
          //console.log("x.invert(d3.event.x): " + formatDateIntoYear(x.invert(d3.event.x)) );
          //console.log("d3.event.x: " + d3.event.x );
          h = x.invert(d3.event.x);
          handle.attr("cx", x(h));
          sliderCircleX = d3.event.x;
          sliderCircleY = d3.event.y;
          //label
          //    .attr("x", x(h))
          //    .text(formatDate(h));
          updateView(formatDateIntoYear(h), triggerSelected )
        }));

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
/*
var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")")
*/

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9)
    .attr("cx",  sliderCircleX)
    .attr("cy", sliderCircleY)
    ;

    /*
function hue(h) {
  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(formatDate(h));
  svg.style("background-color", d3.hsl(h/1000000000, 0.8, 0.8));
}
*/

}


var mapColor = d3.scaleLinear()
                        //.range(['#ffffd4','#fee391','#fec44f','#fe9929','#d95f0e','#993404']);
                         .range(['#fef0d9','#fdcc8a','#fc8d59','#d7301f']);

function debugMsg(message) {
    gDebugMsg = "DEBUG: " + message;
    document.getElementById('debugMsg').innerHTML = gDebugMsg;
}

function isRealValue(obj) {
 return obj && obj !== 'null' && obj !== 'undefined';
}

function svgContainerInit(action="hold") {
    //d3.select(".abtVizMsg").style("visibility", "hidden");

    svgContainer =  d3.select(".dispContainer").select("svg");
    svgContainer.attr("width", gWidth).attr("height", gHeight);
    console.log("In svgContainerInit(): action = " + action );

      switch (action) {
      case "clear":
        console.log("Clearing svg elements: action = " + action );
        //document.getElementById('#abtVizDiv').style.display = 'none';
        //document.getElementById('#featuresButtons').style.display = 'none';
        svgContainer.selectAll("*").remove();
        d3.selectAll(".featuresButtonsA").remove();
        break;
      default:
         console.log("In svgContainerInit: Not clearing objects.");
    }
}

function sliderContainerReset(){
  d3.selectAll(".slider").remove();
}


function updateView(yearToDisplay=2015,featureToDisplay="") {
  travYear = yearToDisplay;
  console.log ("Inside updateView(). yearToDisplay: " + yearToDisplay);
  console.log ("Inside updateView(). featureToDisplay: " + featureToDisplay);
  if(featureToDisplay != "" || featureToDisplay != null)
  {
    triggerSelected = parseInt(featureToDisplay);
  }

      if (!isRealValue(triggerSelected)) {
        showHide('abtViz');
        svgContainerInit();
        var choiceBtn = d3.select(".featuresButtonsA")
        .selectAll("button")
        .data(abtVizMsgMenu.features)
        .enter().append("button")
        .attr("id", "abtVizBtn")
        .text(function(d) { return d.value; })
        .on("click", function(buttonValue) {
            triggerSelected=buttonValue.key;
            document.getElementById("abtVizBtn").style.display = 'none';
            svgContainerInit("clear");
            sliderContainerReset();
            showHide('abtVizDiv', "show"); return false;
          });
          overview();
      } else {
        //d3.select(".abtVizMsg").style("visibility", "none");
        showHide('abtVizDiv', "hide");
        displayTheScene(triggerSelected);
      }
}


function showHide(shID, show="show") {
  console.log("Entering showHide()");

  if (document.getElementById(shID)) {
    console.log("showHide(): shID: " + shID + "show: " + show);
    if (show == "hide") {
      document.getElementById(shID).style.display = 'none';
    } else {
      document.getElementById(shID).style.display = 'block';
    }
  }
}


function makeVizMsgHidden(){
  var div = document.getElementById('vizMsg');
  div.style.visibility = 'hidden';
}


function displayTheScene(choice) {
  console.log("Validating svgContainer: " + isRealValue(svgContainer));
  console.log ("In displayTheScene: value of choice is: " + choice );
  svgContainerInit("clear");


  var sequentialButtons = d3.select(".featuresButtons")
  .selectAll("button")
  .data(analysisFeaturesMenu.features)
  .enter().append("button")
  .text(function(d) { return d.key; })
  .on("click", function(buttonValue) {
      triggerSelected=buttonValue.key;
      console.log("triggerSelected: " + triggerSelected);
      console.log("Calling displayTheScene following features button click");
      displayTheScene(buttonValue.key);

  });

  choice = parseInt(choice);

  var sceneheading = "2010-2015 ACS Analysis: ";
  switch (choice) {
    case 1:
      sceneheading = sceneheading +  "Population Overview";
      break;
    case 2:
      sceneheading = sceneheading +   "Income to Poverty Ratio";
      break;
    case 3:
      sceneheading = sceneheading +  "Racial distribution";
      break;
    default:
      sceneheading = sceneheading +  "Unknown scene!";
      break;
    }

  //document.getElementById("sceneheadingstr").innerHTML=sceneheading;

  console.log("Choice after parseInt: " + choice)
  switch (choice) {
    case 1:
      overview();
      break;
    case 2:
      incomepoverty();
      break;
    case 3:
      racialdist();
      break;
    default:
      console.log("displayScene could not be rendered. The choice was: " + choice);
      break;
    }
}



function overview() {
var width = canvasWidth,
    height = canvasHeight;
console.log("Inside Overview");


var mapColor = d3.scaleLinear()
                         //.range(['#ffffd4','#fee391','#fec44f','#fe9929','#d95f0e','#993404']
                         //.range(['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']
                         //.range(['#fef0d9','#fdcc8a','#fc8d59','#d7301f']
                         .range(['#fee8c8','#fdbb84','#e34a33']
                        );


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
slider();
}


function incomepoverty(){

  var width = canvasWidth,
  height = canvasHeight -  margin.slider - 100;

  var lmargin = {top: 20, right: 20, bottom: 100, left: 40},
  width = canvasWidth - lmargin.left - lmargin.right,
  height = canvasHeight - lmargin.top - lmargin.bottom;

var x = d3.scaleLinear()
  .range([0, width]);

var y = d3.scaleLinear()
  .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

/*
var color = d3.scaleOrdinal()
  .domain(myData)
  .range(d3.schemePaired);

*/

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

/*
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

  */
var svg = svgContainer
.append("g")
  .attr("transform", "translate(" + lmargin.left + "," + lmargin.top + ")");


  var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  data=null;

  d3.csv(fileKeyStatsByStateURL, function(error, data) {

    data.forEach(function(d) {
      d.IncomePerCap = parseInt(d.IncomePerCap);
      d.Unemployment = parseInt(d.Unemployment);
      d.Poverty = parseInt(d.Poverty);
      d.ChildPoverty = parseInt(d.ChildPoverty);
    });



x.domain(d3.extent(data, function(d) { return d.IncomePerCap; })).nice();
y.domain(d3.extent(data, function(d) { return d.Poverty; })).nice();
color.domain(data, function (d) {return d.Unemployment;});

// Circle size (Represents Child Poverty)
var cirRadValue = function(d) { return d["ChildPoverty"];},
cirRadScale = d3.scaleLinear().range([3.5, 3.8]),
cirRadMap = function(d) { return cirRadScale(cirRadValue(d));};


svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Per Capita Income");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Poverty (%)")

svg.selectAll(".dot")
    .data(data)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("r", cirRadMap)
    .attr("cx", function(d) { return x(d.IncomePerCap); })
    .attr("cy", function(d) { return y(d.Poverty); })
    .style("fill", function(d) { return color(d.Unemployment); })
    .on("mouseover", function(d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(d["State"])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
      });

var legend = svg.selectAll(".legend")
    .data(color.domain())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

});
slider();

}

function racialdist() {
  var width = canvasWidth,
      height = canvasHeight -  margin.slider - 100;

var svg = svgContainer,
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(['#feedde','#fdbe85','#fd8d3c','#e6550d','#a63603']
  );


d3.csv(fileRacialDistributionPerRegionURL , function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = parseFloat(d[columns[i]]).toPrecision(2);
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  x0.domain(data.map(function(d) { return d.Region; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.Region) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});

slider();


}
