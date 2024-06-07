const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postController');
const validator = require('../middlewares/validator');
const {slugChecker} = require('../validations/posts');



router.post('/', postsController.store);

router.get('/', postsController.index);

router.get('/:slug', validator(slugChecker), postsController.show);

router.put('/:slug', postsController.update);

router.delete('/:slug', postsController.destroy);

module.exports = router;