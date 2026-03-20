const prisma = require('../lib/prisma');
const emailService = require('../services/emailService');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: create an in-app notification
// ─────────────────────────────────────────────────────────────────────────────
const createNotification = async (userId, bookingId, message) => {
  await prisma.notification.create({
    data: { userId, bookingId, message, type: 'IN_APP' },
  });
};

// POST /api/bookings  — Customer creates a booking
const createBooking = async (req, res) => {
  const { barberId, dateTime, service, notes, lang } = req.body;
  const customerLang = lang === 'fr' ? 'fr' : 'en';
  const customerId = req.user.id;

  try {
    const start = new Date(dateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1-hour slot

    // Prevent double-booking
    const conflict = await prisma.booking.findFirst({
      where: {
        barberId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        AND: [{ dateTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });
    if (conflict) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const booking = await prisma.booking.create({
      data: { customerId, barberId, dateTime: start, endTime: end, service, notes, lang: customerLang },
      include: {
        customer: { select: { name: true, email: true } },
        barber:   { select: { name: true, email: true } },
      },
    });

    // Notify customer and barber via email (fire-and-forget — don't block response)
    emailService.sendBookingConfirmationToCustomer({
      customerEmail: booking.customer.email,
      customerName:  booking.customer.name,
      barberName:    booking.barber.name,
      service, dateTime: start, bookingId: booking.id,
      lang: customerLang,
    }).catch(console.error);

    emailService.sendNewBookingToBarber({
      barberEmail: booking.barber.email,
      barberName:  booking.barber.name,
      customerName: booking.customer.name,
      service, dateTime: start, bookingId: booking.id,
    }).catch(console.error);

    // In-app notification for barber
    await createNotification(barberId, booking.id, `New booking from ${booking.customer.name} for ${service}`);

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// GET /api/bookings  — Customer sees own bookings; Barber sees assigned bookings
const getBookings = async (req, res) => {
  const { id: userId, role } = req.user;
  try {
    const where = role === 'CUSTOMER'
      ? { customerId: userId }
      : role === 'BARBER'
      ? { barberId: userId }
      : {}; // ADMIN sees all

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        barber:   { select: { id: true, name: true, email: true } },
      },
      orderBy: { dateTime: 'asc' },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// GET /api/bookings/available  — Get available slots for a barber
const getAvailableSlots = async (req, res) => {
  const { barberId, date } = req.query;
  if (!barberId || !date) return res.status(400).json({ error: 'barberId and date required' });

  try {
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd   = new Date(`${date}T23:59:59.999Z`);

    const booked = await prisma.booking.findMany({
      where: {
        barberId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        dateTime: { gte: dayStart, lte: dayEnd },
      },
      select: { dateTime: true, endTime: true },
    });

    res.json({ bookedSlots: booked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
};

// PATCH /api/bookings/:id/status  — Barber confirms/rejects; Customer cancels
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { id: userId, role } = req.user;

  const BARBER_ACTIONS   = ['CONFIRMED', 'CANCELLED'];
  const CUSTOMER_ACTIONS = ['CANCELLED'];

  if (role === 'BARBER' && !BARBER_ACTIONS.includes(status))
    return res.status(400).json({ error: 'Barbers can only CONFIRM or CANCEL' });
  if (role === 'CUSTOMER' && !CUSTOMER_ACTIONS.includes(status))
    return res.status(400).json({ error: 'Customers can only CANCEL' });

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        barber:   { select: { id: true, name: true, email: true } },
      },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Authorization check
    if (role === 'CUSTOMER' && booking.customerId !== userId)
      return res.status(403).json({ error: 'Not your booking' });
    if (role === 'BARBER' && booking.barberId !== userId)
      return res.status(403).json({ error: 'Not your booking' });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        barber:   { select: { id: true, name: true, email: true } },
      },
    });

    // Email notifications
    if (status === 'CONFIRMED' || (status === 'CANCELLED' && role === 'BARBER')) {
      // Barber acted → notify customer in their preferred language
      emailService.sendBookingStatusToCustomer({
        customerEmail: booking.customer.email,
        customerName:  booking.customer.name,
        service:       booking.service,
        dateTime:      booking.dateTime,
        status,
        lang:          booking.lang,
      }).catch(console.error);
      await createNotification(booking.customerId, id, `Your booking for ${booking.service} has been ${status.toLowerCase()}`);
    }

    if (status === 'CANCELLED' && role === 'CUSTOMER') {
      // Customer cancelled → notify barber
      emailService.sendCancellationToBarber({
        barberEmail:  booking.barber.email,
        barberName:   booking.barber.name,
        customerName: booking.customer.name,
        service:      booking.service,
        dateTime:     booking.dateTime,
      }).catch(console.error);
      await createNotification(booking.barberId, id, `${booking.customer.name} cancelled their ${booking.service} booking`);
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// GET /api/bookings/calendar  — All active slots for calendar display (no personal info)
const getCalendarBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: { in: ['PENDING', 'CONFIRMED'] } },
      select: {
        id: true,
        dateTime: true,
        endTime: true,
        service: true,
        status: true,
        barber: { select: { id: true, name: true } },
      },
      orderBy: { dateTime: 'asc' },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch calendar bookings' });
  }
};

// GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        barber:   { select: { id: true, name: true, email: true } },
      },
    });
    if (!booking) return res.status(404).json({ error: 'Not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

module.exports = { createBooking, getBookings, getAvailableSlots, updateBookingStatus, getBookingById, getCalendarBookings };
