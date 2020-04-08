var mongoose = require('mongoose');

// Holds each camera's source
var cameraSchema = new mongoose.Schema({
    name: {type: String, required:true},
    location: String,
    refreshRate: {type: Number, required:true},
    ip: {type: String, required:true, unique:true},
    images: [{}]
})

// Check if feed is updated
cameraSchema.methods.isReady = function () {
    // No ref img, allow capture now
    if(this.images.length < 1){
        return true
    }

    var now = new Date();
    var lastRefresh = 
        this.images[this.images.length - 1]['timeTaken']

    // Check the refresh rate time passed
    if ((now - lastRefresh)/1000 > this.refreshRate){
        return true; // allow capture
    }
    return false; // wait more
}

var CameraModel = mongoose.model('Camera', cameraSchema);

module.exports.get = function (callback, limit) {
    CameraModel.find(callback).limit(limit);
}
module.exports = CameraModel;

