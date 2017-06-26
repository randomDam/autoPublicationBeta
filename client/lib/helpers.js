Template.registerHelper("isText", function(id){
  var source = Sources.findOne({_id:id});
  if(source) return Medias.findOne({_id:source.media_id}).isText
})
Template.registerHelper("isImage", function(id){
  var source = Sources.findOne({_id:id});
  if(source) return Medias.findOne({_id:source.media_id}).isImage
})
