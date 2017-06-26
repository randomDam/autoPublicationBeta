Template.registerHelper("isText", function(id){
  var source = Sources.findOne({_id:id});
  if(source) return Medias.findOne({_id:source.media_id}).isText
})
Template.registerHelper("isImage", function(id){
  var source = Sources.findOne({_id:id});
  if(source) return Medias.findOne({_id:source.media_id}).isImage
})
Template.registerHelper("source_content", function(id) {
    //return Sources.findOne(id)._id
    var source = Sources.findOne(id)
    var media = Medias.findOne({_id:source.media_id})
    //return media.link()
    return source.content
})
