// UGLY HACKs
var treemap;
var node;
var goodType = 'tritanium';
var comparisonType = 'average';

// Just grabs a value based on Good Type (Tritanium, Wood, etc) and Comparison type (Min, Mean, Max)
var valueFromGoodAndComparison = function(d) {
  var data = _.find(d.goods, function(good){
    return good.name == goodType
  });
  return data[comparisonType];
};

var sortRegionsByGoodAndComparison = function(root){
  root.children = _.sortBy(root.children, function(region){
    return valueFromGoodAndComparison(region)
  });
};

var position = function position() {
  this.style("left", function(d) { return d.x + "px"; })
    .style("top", function(d) { return d.y + "px"; })
    .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
    .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
};

/*
  Adapted from http://bl.ocks.org/mbostock/4063582
 */
var d3TreeMap = function(regionData) {

  sortRegionsByGoodAndComparison(regionData);

  var margin = {top: 0, right: 0, bottom: 10, left: -80},
    width = 780,
    height = 500 - margin.top - margin.bottom;

  var color = d3.scale.category20c();

  treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(valueFromGoodAndComparison);

  var div = d3.select("#TreeMap").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

  node = div.datum(regionData).selectAll('.node')
    .data(treemap.nodes)
    .enter().append("div")
    .attr("class", "node")
    .call(position)
    .style("background", function(d) {
      return color('test');
    })
    .text(function(d) {
      return d.name;
    });
};

Meteor.startup(function(){
  d3TreeMap(regions);
});

// Render the treemap when our session vars change
Deps.autorun(function() {
  goodType = Session.get('goodType');
  comparisonType = Session.get('comparisonType');
  if (!treemap || !node) {
    return; // good 'ol 'break'
  }
  sortRegionsByGoodAndComparison(regions);
  node.data(treemap.value(valueFromGoodAndComparison).nodes)
    .transition()
    .duration(1500)
    .call(position)
});
