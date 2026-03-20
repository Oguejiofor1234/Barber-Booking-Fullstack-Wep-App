/**
 * Gallery API Tests
 * Tests: GET /api/gallery, POST /api/gallery (upload), DELETE /api/gallery/:id
 */

const request          = require('supertest');
const { PrismaClient } = require('@prisma/client');
const bcrypt           = require('bcryptjs');
const path             = require('path');
const fs               = require('fs');
const app              = require('../src/index');

const prisma = new PrismaClient();

let barberToken   = '';
let customerToken = '';
let barberId      = '';
let customerId    = '';
let galleryItemId = '';

// ── Seed users ────────────────────────────────────────────────────────────────

beforeAll(async () => {
  const hash = await bcrypt.hash('TestPass123', 10);
  const ts   = Date.now();

  const barber = await prisma.user.create({
    data: { name: 'Gallery Barber', email: `gbaber_${ts}@test.com`, password: hash, role: 'BARBER' },
  });
  const customer = await prisma.user.create({
    data: { name: 'Gallery Customer', email: `gcust_${ts}@test.com`, password: hash, role: 'CUSTOMER' },
  });

  barberId   = barber.id;
  customerId = customer.id;

  const br = await request(app).post('/api/auth/login').send({ email: barber.email,   password: 'TestPass123' });
  const cr = await request(app).post('/api/auth/login').send({ email: customer.email, password: 'TestPass123' });

  barberToken   = br.body.token;
  customerToken = cr.body.token;
});

// ── Cleanup ───────────────────────────────────────────────────────────────────

afterAll(async () => {
  await prisma.galleryItem.deleteMany({});
  await prisma.user.deleteMany({ where: { id: { in: [barberId, customerId] } } });
  await prisma.$disconnect();
});

// ── GET Gallery ───────────────────────────────────────────────────────────────

describe('GET /api/gallery', () => {
  it('should return gallery items (public, no auth required)', async () => {
    const res = await request(app)
      .get('/api/gallery')
      .expect(200);

    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('should support type filter ?type=IMAGE', async () => {
    const res = await request(app)
      .get('/api/gallery?type=IMAGE')
      .expect(200);

    expect(res.body.items.every(i => i.type === 'IMAGE')).toBe(true);
  });

  it('should support pagination ?page=1&limit=6', async () => {
    const res = await request(app)
      .get('/api/gallery?page=1&limit=6')
      .expect(200);

    expect(res.body.pagination.limit).toBe(6);
    expect(res.body.pagination.page).toBe(1);
  });
});

// ── Upload ────────────────────────────────────────────────────────────────────

describe('POST /api/gallery', () => {
  // Create a tiny 1x1 PNG buffer for testing
  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  const tmpFile = path.join(__dirname, 'test_upload.png');

  beforeAll(() => fs.writeFileSync(tmpFile, pngBuffer));
  afterAll(() => { if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile); });

  it('barber should be able to upload an image', async () => {
    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${barberToken}`)
      .field('title', 'Test Upload')
      .field('description', 'A test image')
      .attach('file', tmpFile)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.type).toBe('IMAGE');
    expect(res.body.title).toBe('Test Upload');
    galleryItemId = res.body.id;
  });

  it('customer should NOT be able to upload (403)', async () => {
    await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${customerToken}`)
      .field('title', 'Unauthorized Upload')
      .attach('file', tmpFile)
      .expect(403);
  });

  it('should return 400 when no file is attached', async () => {
    await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${barberToken}`)
      .field('title', 'No file')
      .expect(400);
  });

  it('should return 401 when unauthenticated', async () => {
    await request(app)
      .post('/api/gallery')
      .attach('file', tmpFile)
      .expect(401);
  });
});

// ── Delete ────────────────────────────────────────────────────────────────────

describe('DELETE /api/gallery/:id', () => {
  it('customer should NOT be able to delete (403)', async () => {
    if (!galleryItemId) return;
    await request(app)
      .delete(`/api/gallery/${galleryItemId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);
  });

  it('barber should be able to delete their uploaded item', async () => {
    if (!galleryItemId) return;
    await request(app)
      .delete(`/api/gallery/${galleryItemId}`)
      .set('Authorization', `Bearer ${barberToken}`)
      .expect(200);
  });

  it('should return 404 for non-existent gallery item', async () => {
    await request(app)
      .delete('/api/gallery/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${barberToken}`)
      .expect(404);
  });
});
