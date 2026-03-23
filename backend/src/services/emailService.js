const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM     = process.env.SENDGRID_FROM || 'oguejiofor.mbah@fuoye.edu.ng';
const TIMEZONE = process.env.SHOP_TIMEZONE || 'America/Toronto';

// Skip sending if SendGrid API key is not configured
const smtpEnabled = () => !!process.env.SENDGRID_API_KEY;

const send = ({ to, subject, html }) =>
  sgMail.send({ from: FROM, to, subject, html });

/**
 * Format a booking date/time using the appropriate locale.
 */
const formatDateTime = (dt, lang = 'en') =>
  new Date(dt).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZone: TIMEZONE,
  });

// ─────────────────────────────────────────────────────────────────────────────
// Shared HTML wrapper
// ─────────────────────────────────────────────────────────────────────────────
const wrapHtml = (body) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
    <div style="background:#1a1a2e;padding:24px;text-align:center">
      <h1 style="color:#FFD700;margin:0">✂️ JP Barber Shop</h1>
    </div>
    <div style="padding:32px">${body}</div>
  </div>`;

// ─────────────────────────────────────────────────────────────────────────────
// Customer email: booking received
// ─────────────────────────────────────────────────────────────────────────────
const sendBookingConfirmationToCustomer = async ({ customerEmail, customerName, barberName, service, dateTime, bookingId, lang = 'en' }) => {
  if (!smtpEnabled()) return;
  const isFr = lang === 'fr';

  const subject = isFr ? '📅 Demande de Réservation Reçue !' : '📅 Booking Request Received!';

  const body = isFr ? `
    <h2>Bonjour ${customerName} !</h2>
    <p>Votre demande de réservation a bien été <strong>reçue</strong>. Le barbier confirmera votre rendez-vous sous peu.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Service</td><td style="padding:8px">${service}</td></tr>
      <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Barbier</td><td style="padding:8px">${barberName}</td></tr>
      <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Date & Heure</td><td style="padding:8px">${formatDateTime(dateTime, 'fr')}</td></tr>
      <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">N° de Réservation</td><td style="padding:8px">${bookingId}</td></tr>
    </table>
    <p style="color:#888">Vous recevrez un autre e-mail dès que le barbier aura confirmé votre réservation.</p>` : `
    <h2>Hi ${customerName}!</h2>
    <p>Your booking request has been <strong>received</strong>. The barber will confirm shortly.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Service</td><td style="padding:8px">${service}</td></tr>
      <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Barber</td><td style="padding:8px">${barberName}</td></tr>
      <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Date & Time</td><td style="padding:8px">${formatDateTime(dateTime, 'en')}</td></tr>
      <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Booking ID</td><td style="padding:8px">${bookingId}</td></tr>
    </table>
    <p style="color:#888">You'll receive another email once the barber confirms your booking.</p>`;

  await send({ to: customerEmail, subject, html: wrapHtml(body) });
};

// ─────────────────────────────────────────────────────────────────────────────
// Customer email: booking confirmed or cancelled by barber
// ─────────────────────────────────────────────────────────────────────────────
const sendBookingStatusToCustomer = async ({ customerEmail, customerName, service, dateTime, status, lang = 'en' }) => {
  if (!smtpEnabled()) return;
  const isFr = lang === 'fr';
  const isConfirmed = status === 'CONFIRMED';
  const color = isConfirmed ? '#28a745' : '#dc3545';
  const emoji = isConfirmed ? '✅' : '❌';

  const subject = isFr
    ? (isConfirmed ? `${emoji} Réservation Confirmée !` : `${emoji} Réservation Annulée`)
    : (isConfirmed ? `${emoji} Booking Confirmed!`      : `${emoji} Booking Cancelled`);

  const statusLabel = isFr
    ? (isConfirmed ? 'CONFIRMÉE' : 'ANNULÉE')
    : status;

  const body = isFr ? `
    <h2>Bonjour ${customerName} !</h2>
    <p>Votre r&eacute;servation pour <strong>${service}</strong> le <strong>${formatDateTime(dateTime, 'fr')}</strong> a &eacute;t&eacute;
      <span style="color:${color};font-weight:bold">${statusLabel}</span>.
    </p>
    <p style="color:#555;margin-top:16px">${isConfirmed
      ? "Nous avons h&acirc;te de vous accueillir&nbsp;! Merci d'arriver 5 minutes en avance."
      : "N'h&eacute;sitez pas &agrave; r&eacute;server un autre cr&eacute;neau quand vous le souhaitez."}</p>` : `
    <h2>Hi ${customerName}!</h2>
    <p>Your booking for <strong>${service}</strong> on <strong>${formatDateTime(dateTime, 'en')}</strong> has been
      <span style="color:${color};font-weight:bold">${statusLabel}</span>.
    </p>
    <p style="color:#555;margin-top:16px">${isConfirmed
      ? 'We look forward to seeing you! Please arrive 5 minutes early.'
      : 'Feel free to book another slot at your convenience.'}</p>`;

  await send({ to: customerEmail, subject, html: wrapHtml(body) });
};

// ─────────────────────────────────────────────────────────────────────────────
// Barber emails
// ─────────────────────────────────────────────────────────────────────────────
const sendCancellationToBarber = async ({ barberEmail, barberName, customerName, service, dateTime }) => {
  if (!smtpEnabled()) return;
  await send({
    to: barberEmail,
    subject: '❌ Booking Cancelled by Customer',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>Hi ${barberName},</h2>
        <p><strong>${customerName}</strong> has cancelled their booking:</p>
        <ul>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Date & Time:</strong> ${formatDateTime(dateTime)}</li>
        </ul>
        <p>The slot is now available for other customers.</p>
      </div>`,
  });
};

const sendNewBookingToBarber = async ({ barberEmail, barberName, customerName, service, dateTime, bookingId }) => {
  if (!smtpEnabled()) return;
  await send({
    to: barberEmail,
    subject: '📋 New Booking Request',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>Hi ${barberName},</h2>
        <p>You have a new booking request from <strong>${customerName}</strong>.</p>
        <ul>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Date & Time:</strong> ${formatDateTime(dateTime)}</li>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
        </ul>
        <p>Please log in to your dashboard to confirm or reject the booking.</p>
      </div>`,
  });
};

module.exports = {
  sendBookingConfirmationToCustomer,
  sendBookingStatusToCustomer,
  sendCancellationToBarber,
  sendNewBookingToBarber,
};
