var fs = require('fs');
var request = require('request');
var config = require('./config');
var Camera = require('./api/models/cameraModel');

class Scrapper {

    constructor(){
        // create image save folder
        if (!fs.existsSync(config.saveLocation)){
            fs.mkdirSync(config.saveLocation);
        }
    }

    // download feeds until stopped
    start(){

        var s = this;
        
        // Run every 3 seconds
        setInterval(function(){

            // Grab cameras
            Camera.find({}, function(err, cameras) {

                // Loop through each camera
                for (let i = 0; i < cameras.length; i++) {

                    // Has it had time to update?
                    if (cameras[i].isReady()){
                        console.log(
                            '[' + new Date() + ']' + 
                            " Taking photo - " + cameras[i].name
                        )
                        s.captureFeed(cameras[i]['_id']);
                    }
            
                }

            });
        
        }, config.tickRate)
        
    }

    // Download feed from source
    getLiveFeed(camera){
        return new Promise((resolve, reject) => {

            request.head(camera.ip, function(err, res, body){

                if (!err){
    
                    // Create file path
                    var fileType = res.headers['content-type'].split('/')[1]
                    var fileName = `${camera._id}_${Date.now()}.${fileType}`
                    var filePath = config.saveLocation + fileName;
    
                    // Save image on disk
                    request(camera.ip).pipe(fs.createWriteStream(filePath)).on('close', function(){
                        resolve(filePath);
                    });
                }
    
                else {
                    console.log('Couldnt download ' + camera.ip);
                    reject(err);
                }
            });
        });
    }

    // Save image on file with link in db
    captureFeed(camera_id){
        
        var getLiveFeeds = this.getLiveFeed;

        Camera.findById(camera_id).exec(function (err, camera){
            
            if (err){
                if(err.name == "CastError")
                    console.log("Cannot Take Image - Invalid ID");
                else
                    console.log(err);
                return
            }

            if (!camera){
                console.log("Cannot Take Image - Invalid ID");
                return
            }

            // Download feed
            getLiveFeeds(camera).then(path => {
                
                // Create new file reference
                var imageRef = {
                    'fileName': path,
                    'timeTaken': new Date()
                }

                // Update list of images for camera
                camera.images.push(imageRef);
                camera.save(function(err) {
                    if (err)
                        throw err;
                });

            }).catch(err => {
                console.log(err);
            });
        });

    }

}

module.exports.Scrapper = Scrapper;
