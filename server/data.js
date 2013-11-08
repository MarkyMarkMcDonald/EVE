Orders = new Meteor.Collection("orders");

var typeId = 34;
var hoursBack = 1;
var apiURL = 'http://api.eve-central.com/api/quicklook?=' + typeId + '&sethours=' + hoursBack;

var getData = function(){
  console.log("Grabbing data");
  var data = HTTP.call('GET', apiURL);
  return data;
};

Meteor.methods({
  getData: getData
});