Template.goodType.events({
  'change input': function(event){
    Session.set('goodType', event.target.value);
  }
});