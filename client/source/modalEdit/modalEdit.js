
Template.modalEdit.helpers({
    getPathById: function(){
        return Images.findOne({"_id":idSelected}).link();
    }
});

Template.modalEdit.events({
    "click #closeEditModal": function(event, template){
      console.log("Click")
      Blaze.remove(Template.instance().view);
    }
});
