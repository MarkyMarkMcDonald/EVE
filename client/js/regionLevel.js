Template.treeMap.events({
  'click .node': function(event){
    Session.set('currentLevel', $(event.target).attr('name'));
  }
});