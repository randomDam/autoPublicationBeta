import Packery from 'packery';
import Draggabilly from 'draggabilly';

Template.uploadForm.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
});

Template.uploadedFiles.onRendered(function() {
    console.log("rendered : "  +$(".mediaBloc").length);

    organise();
    orderItems();
});


Template.sourcesView.helpers({
  hasSources : function(){
    if(Sources.find().count()>0) return true
    return false
  },
  sources : function(){
    return Sources.find();

  },
  doneTrigger: function() {
    Meteor.defer(function() {
        organise();
        orderItems();
    });
    return null;
  },
  file : function(){
    return Medias.findOne({_id:this.media_id})
  }

});


//-----------------------------------------------------------------------------
// organiser et ordonner les items (media box)
//-----------------------------------------------------------------------------
pckry = null;

organise = function() {
    pckry = new Packery('#mediaCollection', {
        itemSelector: '.mediaBloc',
        columnWidth: 220
    });

    pckry.getItemElements().forEach(function(itemElem) {
        var draggie = new Draggabilly(itemElem);
        pckry.bindDraggabillyEvents(draggie);
    });

    pckry.on('layoutComplete', orderItems);
    pckry.on('dragItemPositioned', orderItems);
}

orderItems = function() {
    if(pckry!=null)
    pckry.getItemElements().forEach(function(itemElem, i) {
        itemElem.getElementsByClassName("mediaNumber")[0].innerText = i + 1;
    });
}


Template.uploadForm.helpers({
    currentUpload: function() {
        return Template.instance().currentUpload.get();
    }
});


Template.uploadedFiles.helpers({
    uploadedFilesImages: function() {
        return Medias.find();
    },
    isSelected: function(id) {
        //console.log("id"+id);

        if (Session.get("current") == id) {
            return "selected";
        } else {
            return "";
        }
    }
});

Session.setDefault("currentSourceId", {})

Template.sourcesView.events({
    "click .edit": function(event, template){
        Session.set("currentSourceId", this._id);
        Blaze.render(Template.modalEdit, $("#main")[0]);
    }
});


fileList = null;
templateUp = null;

Template.uploadForm.events({
    'change #fileInput': function(e, template) {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            console.log("up media");
            console.log(e.currentTarget.files);

            templateUp = template;

            if (e.currentTarget.files && e.currentTarget.files[0]) {
                // We upload only one file, in case
                // there was multiple files selected
                fileList = [];

                for (var i = 0; i < e.currentTarget.files.length; i++) {
                    fileList.push(e.currentTarget.files[i]);
                }

                upLoadFonction(fileList[0]);
            }
        }
    }
});


upLoadFonction = function(file) {

    if (file) {
        var uploadInstance = Medias.insert({
            file: file,
            streams: 'dynamic',
            chunkSize: 'dynamic'
        }, false);


        uploadInstance.on('start', function() {
            templateUp.currentUpload.set(this);
        });

        uploadInstance.on('end', function(error, fileObj) {
            if (error) {
                console.log('Error during upload: ' + error.reason);
            } else {
                console.log('File "' + fileObj.name + '" successfully uploaded');
                fileList.splice(0, 1);
                console.log(fileList);
                if (fileList.length > 0) upLoadFonction(fileList[0]);
            }
            templateUp.currentUpload.set(false);
            organise();
        });

        uploadInstance.start();
    }
}
