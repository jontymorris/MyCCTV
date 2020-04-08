var Camera = require('../models/cameraModel');

exports.index = function (req, res) {
    Camera.get(function (err, cameras) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        
        else {
            console.log(`\n[API] Cameras requested\n`);

            res.json({
                status: "success",
                message: "Camera retrieved successfully",
                data: cameras
            });
        }
    });
};

// Handle create contact actions
exports.new = function (req, res) {
    var camera = new Camera(req.body);

    // save the camera and check for errors
    camera.save(function (err) {
         if (err)
            res.json(err);
        else {
            console.log(`\n[API] Camera added: ${camera}\n`);

            res.json({
                message: 'New camera added!',
                data: camera
            });
        }
    });
};

// Handle view contact info
exports.view = function (req, res) {
    Camera.findById(req.params.id, function (err, camera) {
        if (err)
            res.send(err);
        
        else{
            console.log(`\n[API] Camera ${camera._id} requested\n`);

            res.json({
                message: 'Camera details loading...',
                data: camera
            });
        }
    });
};

// Handle update camera info
exports.update = function (req, res) {Camera.findById(req.params.id, function (err, camera) {
        if (err)
            res.send(err);

        camera.name = req.body.name;
        camera.location = req.body.location;
        camera.refreshRate = req.body.refreshRate;
        camera.ip = req.body.ip;
        
        // save the camera and check for errors
        camera.save(function (err) {
            if (err)
                res.json(err);
            else{
                console.log(`\n[API] Camera ${camera._id} updated\n`);

                res.json({
                    message: 'Camera Info updated',
                    data: camera
                });
            }
        });
    });
};

// Handle delete contact
exports.delete = function (req, res) {
    Camera.remove({
        _id: req.params.id
    }, function (err, camera) {
        if (err)
            res.send(err);
        else{
            console.log(`\n[API] Camera ${camera._id} deleted\n`);

            res.json({
                status: "success",
                message: 'Camera deleted'
            });
        }
    });
};