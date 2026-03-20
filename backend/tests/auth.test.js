/**
 * Auth API Tests
 * Tests: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
 */

const request    = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app        = require('../src/index');

const prisma = new PrismaClient();

// ── Helpers ──────────────────────────────────────────────────────────────────

const testUser = {
  name:     'Test User',
  email:    `test_${Date.now()}@example.com`,
  password: 'Password123',
  phone:    '+1234567890',
};

let authToken = '';

// ── Cleanup ───────────────────────────────────────────────────────────────────

afterAll(async () => {
  // Remove test user
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  await prisma.$disconnect();
});

// ── Register ──────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('should register a new customer and return a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name:  testUser.name,
      email: testUser.email,
      role:  'CUSTOMER',
    });
    expect(res.body.user).not.toHaveProperty('password');

    authToken = res.body.token;
  });

  it('should return 409 when email already registered', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(409);

    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bad', email: 'not-an-email', password: 'pass123' });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('should return 400 when password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'X', email: 'x@x.com', password: '12' });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

// ── Login ─────────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('should login with correct credentials and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
    authToken = res.body.token;
  });

  it('should return 401 for wrong password', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' })
      .expect(401);
  });

  it('should return 401 for non-existent email', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'irrelevant' })
      .expect(401);
  });
});

// ── GET /me ───────────────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  it('should return current user profile when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.email).toBe(testUser.email);
    expect(res.body).not.toHaveProperty('password');
  });

  it('should return 401 when no token provided', async () => {
    await request(app)
      .get('/api/auth/me')
      .expect(401);
  });

  it('should return 401 for an invalid token', async () => {
    await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken123')
      .expect(401);
  });
});

// ── GET /barbers ──────────────────────────────────────────────────────────────

describe('GET /api/auth/barbers', () => {
  it('should return a list of barbers (public endpoint)', async () => {
    const res = await request(app)
      .get('/api/auth/barbers')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
