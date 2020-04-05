var express = require("express");
var store = require('./storage');
var config = require('./config')
require('console-stamp')(console, {
    'pattern': 'HH:MM:ss',
    'label': false
});

var app = express();
var s = new store.Storage();

// API Routing

app.get("/getCameras", (req, res, next) => {
    s.getCameras().then(cameras => {
        res.json(cameras);
    })
});

app.get("/getImages", (req, res, next) => {

    var id = req.query.id;

    // Is ID a number?
    if (!isNaN(id) && parseInt(Number(id)) == id
        && !isNaN(parseInt(id, 10))){

        s.getCameraImages(id).then(resp => {
            res.json(resp);
        }).catch(err => {
            res.json('something went wrong')
        });
    }
    else
        res.json('invalid ID');
        
});

app.listen(config.port, () => {    
    console.log("Server running on port " + config.port);

    // Update Cameras
    s.getCameras().then(cameras => {

        // Run every second...
        setInterval(function(){

            // Loop through each camera
            for (let i = 1; i < cameras.length; i++) {

                // Has it had time to update?
                if (cameras[i].isReady()){
                    console.log("Taking photo - " + cameras[i].name)
                    s.takeImage(cameras[i]);
                }
            }
        }, 1000)

    });
});

// TODO: On close, exit DB and quit Express