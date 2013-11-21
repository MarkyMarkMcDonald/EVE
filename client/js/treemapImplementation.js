// UGLY HACKs
var treemap;
var parentDiv;
var node;
var subNode;
var goodType = 'tritanium';
var comparisonType = 'average';
var currentRoot = regions;
var currentLevel = 'region';

var getChildrenArrayName = function(){
  return currentRoot.children ? 'children' : 'zones';
};


// Just grabs a value based on Good Type (Tritanium, Wood, etc) and Comparison type (Min, Mean, Max)
var valueFromGoodAndComparison = function(d) {
  var data = _.find(d.goods, function(good){
    return good.name == goodType
  });
  return data[comparisonType];
};

var sortRegionsByGoodAndComparison = function(root){
  return _.sortBy(root.children, function(region){
    return valueFromGoodAndComparison(region);
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
var d3TreeMap = function(dataRoot, color) {

  dataRoot[getChildrenArrayName()]= sortRegionsByGoodAndComparison(dataRoot);

  var margin = {top: 0, right: 0, bottom: 10, left: -80},
    width = 780,
    height = 500 - margin.top - margin.bottom;

  var colors = d3.scale.category20c();

  treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(false)
    .value(valueFromGoodAndComparison);

  parentDiv = d3.select("#TreeMap").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

  node = parentDiv.datum(dataRoot);
  subNode = node
    .selectAll('.node').data(treemap.nodes);
  subNode
    .enter().append("div")
    .attr("class", "node")
    .attr("name", function(d) {
      return d.name;
    })
    .call(position)
    .style("background", function(d) {
      return color ? colors(color) : colors('test');
    })
    .text(function(d) {
      return d.name;
    });
};

Meteor.startup(function(){
  d3TreeMap(regions);
});

var rerender = function(){
  if (!treemap || !node) {
    return; // good 'ol "break"
  }

  subNode.data(treemap.value(valueFromGoodAndComparison).nodes)
    .text(function(d) {
      return d.name;
    })
    .transition()
    .duration(1500)
    .call(position);
//
//  node.datum(currentRoot).selectAll('.node')
//    .data(treemap.nodes)
//    .enter().append("div")
//    .attr("class", "node")
//    .attr("name", function(d) {
//      return d.name;
//    })
//    .transition()
//    .duration(1500)
//    .call(position)
//    .style("background", function(d) {
//      return color ? colors(color) : colors('test');
//    })
//    .text(function(d) {
//      return d.name;
//    });

};

/* Animate to new data based on selection
 *
 * Deps.autorun executes whenever certain dependencies change inside the function. In this specific case, any watched
 * Session changes (Session.get) will force the passed in function to execute
 */
Deps.autorun(function() {
  goodType = Session.get('goodType');
  comparisonType = Session.get('comparisonType');
  var possibleNewLevel = Session.get('currentLevel');
  if (possibleNewLevel.match(/.*region.*/) && !possibleNewLevel.match(/region/)) {
    currentLevel = possibleNewLevel;

    var possibleLowerRegions = currentRoot[getChildrenArrayName()];
    var possibleLowerRegion = _.find(possibleLowerRegions, function(possibleRegion){
      return possibleRegion.name = currentLevel;
    });
    if (possibleLowerRegion && (possibleLowerRegion.children || possibleLowerRegion.zones)) {
      currentRoot = possibleLowerRegion;
    }
  }

  currentRoot[getChildrenArrayName()] = sortRegionsByGoodAndComparison(regions);
  rerender();
});
