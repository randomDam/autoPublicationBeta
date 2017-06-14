//Sources = new Mongo.Collection(null)
Pages = new Mongo.Collection(null)



index = 0
Template.grid.onRendered(function(){
})

Template.grid.helpers({
  pages() {
    return Pages.find({},{sort: {position: 1}})
  }
})

Template.grid.helpers({
  source_content(id){
    //return Sources.findOne(id)._id
    var source = Sources.findOne(id)
    var media = Medias.findOne({_id:source.media_id})
    return media.link()
  },
  isText(id){
    return Medias.findOne({_id:Sources.findOne({_id:id}).media_id}).isText
  },
  isImage(id){
    return Medias.findOne({_id:Sources.findOne({_id:id}).media_id}).isImage
  }
})

Template.grid.events({
  "click .remove-page" : function(){
    if(this.sources.length === 0){
      console.log(this)
      Pages.remove(this._id)
      renumerotation(this.position-1)
    }
  },
  "click button" : function(){
    Pages.insert({position:Pages.find().count()+1, sources:[]})
  },
  "dragover .page" : function(e,t){
    e.preventDefault()

  },
  "dragover .newpage" : function(e,t){
    e.preventDefault()

  },
  "dragstart img" : function(e,t){
    //e.preventDefault()
  },
  "dragstart .source" : function(e,t){
    e.stopPropagation()
      console.log(this)
    e.originalEvent.dataTransfer.setData('text/plain', JSON.stringify({type:"source",id : this._id}))
  },
  "dragstart .page" : function(e,t){
    e.originalEvent.dataTransfer.setData('text/plain', JSON.stringify({type:"page",id : this._id}))
  },
  "dragstart .newpage" : function(e,t){
    e.originalEvent.dataTransfer.setData('text/plain', JSON.stringify({type:"newpage",id : this._id}))
  },


  "drop .page" : function(e,t){
    var data = e.originalEvent.dataTransfer.getData('text/plain')
    data = JSON.parse(data) 
    console.log(data, this)
    if(data.type === "source"){
      e.preventDefault() 
      dropSource(e,this._id, data.id)
    }
    if(data.type === "page"){
      dropPage(this._id, data.id)
    }
    if(data.type === "newpage"){
      addNewPage(this._id, data.id)
    }
  }
})

function renumerotation(position){
  position++
  pages = Pages.find({position : {$gte : position}}).fetch()
  _.each(pages, function(page){
    position++
    page.position = position
    Pages.update({_id:page._id},page)
  })

}

function addNewPage(target_id){
  console.log("Add new page...");
  page_cible = Pages.findOne(target_id)
  console.log(page_cible.position)
  position = page_cible.position 
  newpage = {position : position+1, sources:[]}
  renumerotation(position)
  Pages.insert(newpage)
}

function dropPage(target_id, source_id){
  target = Pages.findOne({_id:target_id})
  source = Pages.findOne({_id:source_id})
  var tmp = target.position
  target.position = source.position
  source.position = tmp
  Pages.update({_id:source._id}, source)
  Pages.update({_id:target._id}, target)
}


function dropSource(e,pageId, sourceId){
    // Remove element from source
    var page_cible = Pages.findOne(pageId)
    var page_source = Pages.findOne({"sources._id" : sourceId})
    var source = Sources.findOne({_id:sourceId})

    if(page_source._id != page_cible._id) {
      if(page_cible.sources.length <2){
        Pages.update({_id:page_source._id}, {$pull : {sources : source}})
          page_cible.sources.push(source)
          Pages.update({_id:page_cible._id}, page_cible)
          //Pages.remove({sources : {$size:0}})
      } else {
          id_element_cible = e.originalEvent.srcElement.id
          var source_cible = Sources.findOne({_id:id_element_cible})
          Pages.update({_id:page_source._id},{$push : {sources : source_cible}}) 
          Pages.update({_id:page_source._id},{$pull : {sources : source}}) 
          Pages.update({_id:page_cible._id},{$pull : {sources : source_cible}}) 
          Pages.update({_id:page_cible._id},{$push : {sources : source}}) 
      }
    } else {
        if(page_cible.sources.length === 2){
            console.log("Swap in same page")
            tmp = page_cible.sources[0]
            page_cible.sources[0] = page_cible.sources[1]
            page_cible.sources[1] = tmp
            Pages.update({_id:page_cible._id}, page_cible)
        }
    }
}

