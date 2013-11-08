/*
  Adapted from http://bl.ocks.org/mbostock/4063582
 */
var d3TreeMap = function(xml) {

  var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var color = d3.scale.category20c();

  var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.price; });

  var div = d3.select("#TreeMap").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

  var node = div.datum(xml.documentElement.getElementsByTagName("order")).enter()
    .data(treemap.nodes)
    .enter().append("div")
    .attr("class", "node")
    .call(position)
    .style("background", function(d) {
      return d['region'];
    })
    .text(function(d) {
      return d['station_name'];
    });

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }
};

Template.getData.events({
  'click button': function(){
    var typeId = 34;
    var hoursBack = 1;
    var apiURL = 'http://api.eve-central.com/api/quicklook?=' + typeId + '&sethours=' + hoursBack;

    d3.xml(apiURL, function(xml) {
      d3TreeMap(xml);
    })
  }
});