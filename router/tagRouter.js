const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const validator = require('../middlewares/validator');
const {nameChecker} = require('../validations/tags');
const {idChecker} = require('../validations/ids');



router.post('/', validator(nameChecker), tagController.store);

router.get('/', tagController.index);

router.get('/:id', validator(idChecker), tagController.show);

router.put('/:id', validator(idChecker), validator(nameChecker), tagController.update);

router.delete('/:id', validator(idChecker), tagController.destroy);

module.exports = router;