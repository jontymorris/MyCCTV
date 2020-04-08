var express = require('express');
var router = express.Router();

var cameraController = require('../controllers/cameraController');


router.get('/', (req, res) => res.send('Welcome to the API'))

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
