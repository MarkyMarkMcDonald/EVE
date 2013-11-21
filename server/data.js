Orders = new Meteor.Collection("orders");

var typeId = 34;
var hoursBack = 1;
var apiURL = 'http://api.eve-central.com/api/quicklook?=' + typeId + '&sethours=' + hoursBack;

var mocked = true;

var getData = function(){
  var data;
  if (!mocked) {
    console.log("Grabbing data");
    data = HTTP.call('GET', apiURL);
    console.log(data.documentElement.getElementsByTagName("order"));
  } else {

  }

  return data;

};

Meteor.methods({
  getData: getData
});