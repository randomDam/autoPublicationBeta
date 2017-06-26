
currentSource = new ReactiveVar(null)

Template.retouches.events({
  "click #update-css" : function(e,t){
    var newcss = $("#rawcsseditor").val().trim() //.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
    var newcontent = $("#rawcontenteditor").val().trim() //.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
    var page = Pages.findOne({"sources._id" : currentSource.get()})
    _.each(page.sources, function(source){
      if(source._id === currentSource.get()){
        source.content = newcontent
        source.css = newcss  
      }
    })
    Pages.update(page._id, {$set:{"sources": page.sources}})
  },

  "click .element" : function(e,t){
    console.log(this._id)
    currentSource.set(this._id)
  }
});


function getCurrentSource(id){
  var page = Pages.findOne({"sources._id":currentSource.get()})
    _.each(page.sources, function(source){
      if(source._id === currentSource.get()){
        return source
      }
    })
  return ""
}



Template.retouches.helpers({
  pages : function(){
    return Pages.find()
  },

  currentCSS : function(){
    if(currentSource.get() != null){
      var source = getCurrentSource(currentSource.get())
      if(source) return source.css
      else return ""

    }
    return "Pas de page"
  },
  currentContent : function(){
    if(currentSource.get() != null){
      var source = getCurrentSource(currentSource.get())
      if(source) return source.content
      else return ""

    }
    return "Pas de page"
  },
    getLink:function(_id){
        Medias.findOne({_id:_id}).link();
    }

})
