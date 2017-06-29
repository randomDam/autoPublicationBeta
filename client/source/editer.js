//Sources = new Mongo.Collection(null)
//Pages = new Mongo.Collection("pages-sources")


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
    //return media.link()
    return source.content
  },
  source_content1(id){
    //return Sources.findOne(id)._id
    var source = Sources.findOne(id)
    var media = Medias.findOne({_id:source.media_id})
    //return media.link()
    return source.rawData
  }
})

Template.grid.events({
  "click .remove-page" : function(){
    //if(this.sources.length === 0){
      _.each(this.sources, function(source_id){
        console.log(source_id);
        var source = Sources.findOne(source_id.source_id);
        Medias.remove(source.media_id);
        Sources.remove(source_id.source_id) 
      })
      Pages.remove(this._id)
      renumerotation(this.position-1)
    //}
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
    e.originalEvent.dataTransfer.setData('application/json', JSON.stringify({type:"source",id : this.source_id}))
  },
  "dragstart .page" : function(e,t){
    e.originalEvent.dataTransfer.setData('application/json', JSON.stringify({type:"page",id : this._id}))
  },
  "dragstart .newpage" : function(e,t){
    e.originalEvent.dataTransfer.setData('application/json', JSON.stringify({type:"newpage",id : this._id}))
  },


  "drop .page" : function(e,t){
    var data = e.originalEvent.dataTransfer.getData('application/json')
    data = JSON.parse(data)
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
  page_cible = Pages.findOne(target_id)
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
    var page_source = Pages.findOne({"sources.source_id" : sourceId})
    var source = Sources.findOne({_id:sourceId})


    if(page_source._id != page_cible._id) {
      if(page_cible.sources.length <2){
          // From one page to another
          Pages.update({_id:page_source._id}, {$pull : {sources : {source_id:sourceId}}})
          page_cible.sources.push({source_id:sourceId})
          Pages.update({_id:page_cible._id}, page_cible)
      } else {
          // Swap from one page with 2 sources to other page
          // TODO !!!!!!!!
          id_element_cible = e.originalEvent.srcElement.id
          var source_cible = Sources.findOne({_id:id_element_cible})
          Pages.update({_id:page_source._id},{$pull : {sources : {source_id:sourceId}}})
          Pages.update({_id:page_cible._id},{$pull : {sources : {source_id:id_element_cible}}})
          Pages.update({_id:page_source._id},{$push : {sources : {source_id:id_element_cible}}})
          Pages.update({_id:page_cible._id},{$push : {sources : {source_id:sourceId}}})
      }
    } else {
        if(page_cible.sources.length === 2){
          // Swapp in the same page
            tmp = page_cible.sources[0]
            page_cible.sources[0] = page_cible.sources[1]
            page_cible.sources[1] = tmp
            Pages.update({_id:page_cible._id}, page_cible)
        }
    }
}
