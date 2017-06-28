import { request } from "meteor/froatsnook:request";

//SERVEUR SIDE
var pathMedia = Meteor.absolutePath + '/medias';

// Les pages contiennent plusieurs sources
Pages = new Mongo.Collection("pages")

// return an object with all page data (media and sources)
Pages.rawData = function(page_id){
  var page = Pages.findOne(page_id);
  var source_ids = page.sources.map(function(source){
    return source.source_id
  })
  return Sources.find({"_id" : {"$in":source_ids}}).fetch()




}

this.Medias = new FilesCollection({
  debug: false,
  collectionName: 'Images',
  storagePath: pathMedia,
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024*1024*20 && /png|jpg|jpeg|txt/i.test(file.extension)) {
      console.log("TRUEEEEE");
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  onBeforeRemove: function () {
    return true;
  },
  onAfterUpload: function(fileRef) {
    var link = Medias.findOne({_id:fileRef._id}).link();
      console.log(fileRef)


    if(fileRef.isImage){
      var css = "width:150px;"
      var content = link;
      console.log("Isimage...")
      var result = request.getSync(link, {encoding:null})  
      var rawData = "data:image/jpeg;base64," + new Buffer(result.body).toString('base64')
      var source = {
        media_id:fileRef._id,
        css:css,
        content:content,
        rawData: rawData
      }
      var source_id = Sources.insert(source);
      var index = Pages.find().count()  
      // Admetons ques tout soit image
      Pages.insert({position:index, sources:[ {source_id:source_id} ] })  
    
    }

    if(fileRef.isText){
      var css = "font-size:10px;"
      var content = "Text content here"
      var result = request.getSync(link, {encoding:null})  
      var rawData = new Buffer(result.body).toString()
      var source = {
        media_id:fileRef._id,
        css:css,
        content:fileRef.name,
        rawData: rawData

      }
      var source_id = Sources.insert(source);
      var index = Pages.find().count()  
      Pages.insert({position:index, sources:[ {source_id:source_id} ] })  
    
    }


  }
});

/*
   Source : 
    {
      media_id:"",
      content:"",
      css:""
 */





this.Sources = new Mongo.Collection("sources");
this.Sources.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
