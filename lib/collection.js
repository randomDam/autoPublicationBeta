
//SERVEUR SIDE
var pathMedia = Meteor.absolutePath + '/medias';

// Les pages contiennent plusieurs sources
Pages = new Mongo.Collection("pages")


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
    var cssImages = "width:150px;"
    var content = "<img src=" + link + " style=" + cssImages + " />"
    var source = {
      media_id:fileRef._id,
      css:cssImages,
      content:content
    }
    var source_id = Sources.insert(source);
    var index = Pages.find().count()  
    // Admetons ques tout soit image
    Pages.insert({position:index, sources:[ {source_id:source_id} ] })  
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
