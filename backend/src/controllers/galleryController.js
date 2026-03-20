const prisma = require('../lib/prisma');
const fs = require('fs');
const path = require('path');

// POST /api/gallery  (multipart/form-data)
const uploadMedia = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { title, description } = req.body;
  const mimeType = req.file.mimetype;
  const type = mimeType.startsWith('video/') ? 'VIDEO' : 'IMAGE';
  const url = `/uploads/${req.file.filename}`;

  try {
    const item = await prisma.galleryItem.create({
      data: { title: title || req.file.originalname, description, type, url },
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save media' });
  }
};

// GET /api/gallery
const getGallery = async (req, res) => {
  const { type, page = '1', limit = '12' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const where = type ? { type } : {};
    const [items, total] = await Promise.all([
      prisma.galleryItem.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.galleryItem.count({ where }),
    ]);

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

// DELETE /api/gallery/:id  (Admin/Barber only)
const deleteMedia = async (req, res) => {
  try {
    const item = await prisma.galleryItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Delete file from disk
    const filePath = path.join(__dirname, '../../', item.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.galleryItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

module.exports = { uploadMedia, getGallery, deleteMedia };
