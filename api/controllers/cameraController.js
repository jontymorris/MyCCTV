var Camera = require('../models/cameraModel');

exports.index = function (req, res) {
    Camera.get(function (err, cameras) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Camera retrieved successfully",
            data: cameras
        });
    });
};

// Handle create contact actions
exports.new = function (req, res) {
    var camera = new Camera(req.body);

    console.log("\nNew Camera Added");
    console.log(camera + "\n");
    
    // save the camera and check for errors
    camera.save(function (err) {
         if (err)
            res.json(err);
        else
            res.json({
                message: 'New camera added!',
                data: camera
            });
    });
};

// Handle view contact info
exports.view = function (req, res) {
    Camera.findById(req.params.id, function (err, camera) {
        if (err)
            res.send(err);
        res.json({
            message: 'Camera details loading..',
            data: camera
        });
    });
};

// Handle update contact info
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
            res.json({
                message: 'Camera Info updated',
                data: camera
            });
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
        res.json({
            status: "success",
            message: 'Camera deleted'
        });
    });
};