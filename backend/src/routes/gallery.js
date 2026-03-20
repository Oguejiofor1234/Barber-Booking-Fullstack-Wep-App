const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadMedia, getGallery, deleteMedia } = require('../controllers/galleryController');

const router = express.Router();

router.get('/', getGallery); // Public
router.post('/', authenticate, authorize('BARBER', 'ADMIN'), upload.single('file'), uploadMedia);
router.delete('/:id', authenticate, authorize('BARBER', 'ADMIN'), deleteMedia);

module.exports = router;
