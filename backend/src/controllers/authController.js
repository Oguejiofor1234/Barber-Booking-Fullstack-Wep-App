const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone, role: 'CUSTOMER' },
    });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// GET /api/auth/barbers
const getBarbers = async (req, res) => {
  try {
    const barbers = await prisma.user.findMany({
      where: { role: { in: ['BARBER', 'ADMIN'] } },
      select: { id: true, name: true, email: true, phone: true },
    });
    res.json(barbers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch barbers' });
  }
};

module.exports = { register, login, getMe, getBarbers };
