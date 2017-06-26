
currentSource = new ReactiveVar(null)

Template.retouches.events({
  "click #update-css" : function(e,t){
    var newcss = $("#rawcsseditor").val().trim() //.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
    var newcontent = $("#rawcontenteditor").val().trim() //.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
    var page = Pages.findOne({"sources.source_id" : currentSource.get()})
    _.each(page.sources, function(source){
      if(source.source_id === currentSource.get()){
        source.content = newcontent
        source.css = newcss  
      }
    })
    Pages.update(page._id, {$set:{"sources": page.sources}})
  },

  "click .element" : function(e,t){
    console.log(this)
    currentSource.set(this.source_id)
  }
});


function getCurrentSource(id){
  var page = Pages.findOne({"sources.source_id":currentSource.get()})
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
    },
  sourcesContent : function(){
    console.log(this)
      sources = []
    _.each(this.sources, function(s){
      sources.push(s.source_id);
    })  
    return Sources.find({_id: {$in:sources}})
  }

})
