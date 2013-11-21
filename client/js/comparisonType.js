Template.comparisonType.events({
  'change input': function(event){
    Session.set('comparisonType', event.target.value);
  }
});