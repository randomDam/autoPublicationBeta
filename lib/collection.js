
//SERVEUR SIDE
var pathMedia = Meteor.absolutePath + '/medias';


this.Images = new FilesCollection({
    debug: false,
    collectionName: 'Images',
    storagePath: pathMedia,
    allowClientCode: true, // Disallow remove files from Client
    onBeforeUpload: function (file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 1024*1024*20 && /png|jpg|jpeg/i.test(file.extension)) {
            console.log("TRUEEEEE");
            return true;
        } else {
            return 'Please upload image, with size equal or less than 10MB';
        }
    },
    onBeforeRemove: function () {
    },
    onAfterUpload: function(fileRef) {

    }
});
