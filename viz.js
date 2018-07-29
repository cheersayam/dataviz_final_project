var svgContainer = null;
var gDebugMsg = null;
var dataFilesBaseURL=null;

var analysisFeaturesMenu =
{ "features" : [
      {"key": "1", "value":"overview"},
      {"key": "2", "value":"incomepoverty"},
      {"key": "3", "value":"racialdist"}
  ]};


  var abtVizMsgMenu =
  { "features" : [
        {"key": "11", "value":"About this visulization"}
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
var margin = {top: 30, right: 20, bottom: 30, left: 50, slider: 60},
    gWidth = 960 - margin.left - margin.right,
    gHeight = 700 - margin.top - margin.bottom,
    canvasWidth = gWidth,
    canvasHeight = gHeight - margin.slider;


function slider(svgContainer) {
var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");

var startDate = new Date("2010-01-01"),
    endDate = new Date("2015-12-31");

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
        .on("start drag", function() {
          //console.log("x.invert(d3.event.x): " + formatDateIntoYear(x.invert(d3.event.x)) );
          //console.log("d3.event.x: " + d3.event.x );
          h = x.invert(d3.event.x);
          handle.attr("cx", x(h));
          //label
          //    .attr("x", x(h))
          //    .text(formatDate(h));
          // UCOMMENT ME:
          // updateView(formatDateIntoYear(h), triggerSelected )
        }));

//        .on("start drag", function() { hue(x.invert(d3.event.x));}));

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
    .attr("r", 9);

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

function updateView(yearToDisplay=2015,featureToDisplay="") {
  var travYear = yearToDisplay;
  console.log ("Inside updateView(). yearToDisplay: " + yearToDisplay);
  console.log ("Inside updateView(). featureToDisplay: " + featureToDisplay);
  if(featureToDisplay != "" || featureToDisplay != null)
  {
    triggerSelected = parseInt(featureToDisplay);
  }


  /*
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
*/
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

  /*
  if (document.getElementById(shID)) {
    console.log("showHide(): shID: " + shID);
    if (document.getElementById(shID).style.display != 'none') {
      console.log("showHide(): shID: " + "NONE");
      document.getElementById(shID).style.display = 'block';
    } else {
      console.log("showHide(): shID: " + "NONONE");
      document.getElementById(shID).style.display = 'none';
    }
  }

*/


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
  /*
  choice = parseInt(choice);
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
    */
  });

  choice = parseInt(choice);
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

/*
function displayAboutVizBtn() {
  svgContainerInit("clear");
  d3.select(".abtVizMsg").style("opacity", "1");

  var displayAboutBtn = d3.select(".abtVizMsg")
    .selectAll("button")
    .data(['About the Visualization'])
    .enter().append("button")
    .text(function(d) { return d; })
    .on("click", function(buttonValue) {
        displayAboutVizMessage();
    });
}
*/

function displayAboutVizMessage() {
  console.log("Inside displayAboutVizMessage()");
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



function overview() {
var width = canvasWidth,
    height = canvasHeight;
console.log("Inside Overview");

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


function incomepoverty(){

  var width = canvasWidth,
  height = canvasHeight-60;

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
    //.attr("r", 3.5)
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
slider(svgContainer);

}

function racialdist() {
  var width = canvasWidth,
      height = canvasHeight - 100;

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
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


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
      .text("Population (log scale)");

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

slider(svgContainer);


}
