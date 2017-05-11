
Template.modalEdit.helpers({
    getPathById: function(_id){
        return Medias.findOne({"_id":_id}).link();
    },
    currentSource : function(){
      var currentSourceId = Session.get("currentSourceId");
      if(currentSourceId) return Sources.findOne({_id:currentSourceId});
      else return {}

    }
});

Template.modalEdit.events({
    "click .closeEditModal": function(event, template){
      Blaze.remove(Template.instance().view);
    },
    "click #addDataToSource": function(event, template){
      //var author = template.find()
      source = form2js("boiteLegende", ".")
      id = source._id
      delete source._id
      console.log(source)
      Sources.update({_id:id},{$set:source})
      Blaze.remove(Template.instance().view);
    }

});
