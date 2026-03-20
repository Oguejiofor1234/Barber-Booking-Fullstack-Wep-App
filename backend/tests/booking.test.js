/**
 * Booking API Tests
 * Tests: POST /api/bookings, GET /api/bookings, PATCH /api/bookings/:id/status
 */

const request         = require('supertest');
const { PrismaClient } = require('@prisma/client');
const bcrypt          = require('bcryptjs');
const app             = require('../src/index');

const prisma = new PrismaClient();

// ── Shared state ──────────────────────────────────────────────────────────────
let customerToken = '';
let barberToken   = '';
let customerId    = '';
let barberId      = '';
let bookingId     = '';

const futureDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);          // 3 days from now
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
};

// ── Seed test users ───────────────────────────────────────────────────────────

beforeAll(async () => {
  const hash = await bcrypt.hash('TestPass123', 10);
  const ts   = Date.now();

  const customer = await prisma.user.create({
    data: { name: 'Customer Test', email: `cust_${ts}@test.com`, password: hash, role: 'CUSTOMER' },
  });
  const barber = await prisma.user.create({
    data: { name: 'Barber Test',   email: `barber_${ts}@test.com`, password: hash, role: 'BARBER' },
  });

  customerId = customer.id;
  barberId   = barber.id;

  // Obtain JWT tokens
  const custRes = await request(app)
    .post('/api/auth/login')
    .send({ email: customer.email, password: 'TestPass123' });
  customerToken = custRes.body.token;

  const barberRes = await request(app)
    .post('/api/auth/login')
    .send({ email: barber.email, password: 'TestPass123' });
  barberToken = barberRes.body.token;
});

// ── Cleanup ───────────────────────────────────────────────────────────────────

afterAll(async () => {
  await prisma.notification.deleteMany({ where: { userId: { in: [customerId, barberId] } } });
  await prisma.booking.deleteMany({
    where: { OR: [{ customerId }, { barberId }] },
  });
  await prisma.user.deleteMany({ where: { id: { in: [customerId, barberId] } } });
  await prisma.$disconnect();
});

// ── Create Booking ────────────────────────────────────────────────────────────

describe('POST /api/bookings', () => {
  it('should create a booking as a customer', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ barberId, dateTime: futureDate(), service: 'Classic Haircut ($25)' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('PENDING');
    expect(res.body.customerId).toBe(customerId);
    bookingId = res.body.id;
  });

  it('should return 409 for double-booking the same slot', async () => {
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ barberId, dateTime: futureDate(), service: 'Beard Trim ($20)' })
      .expect(409);
  });

  it('should return 403 if a BARBER tries to create a booking', async () => {
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${barberToken}`)
      .send({ barberId, dateTime: futureDate(), service: 'Test' })
      .expect(403);
  });

  it('should return 401 when unauthenticated', async () => {
    await request(app)
      .post('/api/bookings')
      .send({ barberId, dateTime: futureDate(), service: 'Test' })
      .expect(401);
  });
});

// ── Get Bookings ──────────────────────────────────────────────────────────────

describe('GET /api/bookings', () => {
  it('customer should see their own bookings', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(b => expect(b.customerId).toBe(customerId));
  });

  it('barber should see bookings assigned to them', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${barberToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(b => expect(b.barberId).toBe(barberId));
  });

  it('should return 401 when unauthenticated', async () => {
    await request(app).get('/api/bookings').expect(401);
  });
});

// ── Get by ID ─────────────────────────────────────────────────────────────────

describe('GET /api/bookings/:id', () => {
  it('should return a specific booking by id', async () => {
    const res = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(res.body.id).toBe(bookingId);
  });

  it('should return 404 for non-existent booking id', async () => {
    await request(app)
      .get('/api/bookings/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(404);
  });
});

// ── Update Booking Status ─────────────────────────────────────────────────────

describe('PATCH /api/bookings/:id/status', () => {
  it('barber should CONFIRM a pending booking', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${barberToken}`)
      .send({ status: 'CONFIRMED' })
      .expect(200);

    expect(res.body.status).toBe('CONFIRMED');
  });

  it('customer should CANCEL their confirmed booking', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'CANCELLED' })
      .expect(200);

    expect(res.body.status).toBe('CANCELLED');
  });

  it('customer should NOT be able to CONFIRM a booking', async () => {
    // Create a fresh booking to attempt confirmation
    const newBook = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ barberId, dateTime: new Date(Date.now() + 7 * 86400000).toISOString(), service: 'Test' });

    if (newBook.status === 201) {
      await request(app)
        .patch(`/api/bookings/${newBook.body.id}/status`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ status: 'CONFIRMED' })
        .expect(400);
    }
  });

  it('should return 401 when unauthenticated', async () => {
    await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .send({ status: 'CONFIRMED' })
      .expect(401);
  });
});

// ── Available Slots ───────────────────────────────────────────────────────────

describe('GET /api/bookings/available', () => {
  it('should return booked slots for a barber on a date', async () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const dateStr = date.toISOString().split('T')[0];

    const res = await request(app)
      .get(`/api/bookings/available?barberId=${barberId}&date=${dateStr}`)
      .expect(200);

    expect(res.body).toHaveProperty('bookedSlots');
    expect(Array.isArray(res.body.bookedSlots)).toBe(true);
  });

  it('should return 400 when barberId or date is missing', async () => {
    await request(app).get('/api/bookings/available?barberId=abc').expect(400);
  });
});
