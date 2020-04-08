var express = require('express');
var router = express.Router();

var cameraController = require('../controllers/cameraController');

// Return README.MD at API root
var marked = require('marked');
var fs = require('fs');

router.get('/', (req, res) => {
    var path = __dirname + '/../../README.md';
    var file = fs.readFileSync(path, 'utf8');
    res.send(marked(file.toString()));
});

// Camera routes
router.route('/cameras')
    .get(cameraController.index)
    .post(cameraController.new);

router.route('/camera/:id')
    .get(cameraController.view)
    .patch(cameraController.update)
    .put(cameraController.update)
    .delete(cameraController.delete);

module.exports = router;
