const express = require('express');
const router = express.Router();
const chargerController = require('../controllers/chargerController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/', authMiddleware, chargerController.createCharger);
router.get('/', authMiddleware, chargerController.getChargers);
router.put('/:id', authMiddleware, chargerController.updateCharger);
router.delete('/:id', authMiddleware, chargerController.deleteCharger);

module.exports = router;
