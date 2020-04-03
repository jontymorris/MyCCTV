var store = require('./storage');

// Custom Logging
require('console-stamp')(console, {
    'pattern': 'HH:MM:ss',
    'label': false
});


var s = new store.Storage();

s.getCameras().then(cameras => {

    // Run every second...
    setInterval(function(){

        // Loop through each camera
        for (let i = 1; i < cameras.length; i++) {

            // Has it had time to update?
            if (cameras[i].isReady()){
                console.log(cameras[i].name + " is ready")
                s.takeImage(cameras[i]);
            }
        }
    }, 1000)

}).finally(function(){
    //s.db.close();
});



