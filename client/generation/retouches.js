
currentPage = new ReactiveVar(null)

Template.retouches.events({
  "click #update-css" : function(e,t){
    var newcss = $("#rawcsseditor").val().trim() //.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
    var newcontent = $("#rawcontenteditor").val().trim() //.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
    Pages.update(currentPage.get(),{$set:{content:newcontent, css:newcss}})
  },

  "click .page" : function(e,t){
    console.log(this._id)
    currentPage.set(this._id)
  }
});



Template.retouches.helpers({
  pages : function(){
    return Pages.find()
  },

  currentCSS : function(){
    if(currentPage.get() != null){
      return Pages.findOne(currentPage.get()).css
    }
    return "Pas de page"
  },
  currentContent : function(){
    if(currentPage.get() != null){
      return Pages.findOne(currentPage.get()).content
    }
    return "Pas de page"
  }

})
