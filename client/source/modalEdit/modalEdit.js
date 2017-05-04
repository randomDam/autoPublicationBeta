
Template.modalEdit.helpers({
    getPathById: function(){
        return Images.findOne({"_id":idSelected}).link();
    }
});

Template.modalEdit.events({
    "click #foo": function(event, template){

    }
});
