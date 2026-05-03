const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const smtpHost = defineSecret('SMTP_HOST');
const smtpPort = defineSecret('SMTP_PORT');
const smtpUser = defineSecret('SMTP_USER');
const smtpPass = defineSecret('SMTP_PASS');
const mailFrom = defineSecret('MAIL_FROM');

const WEDDING_FINISHED_AT_IST = new Date('2026-05-13T00:00:00+05:30');

function buildThankYouEmail(name) {
  const guestName = name || 'Dear guest';

  return {
    subject: 'Thank you for blessing Khushbu & Sujeet',
    text: `Namaste ${guestName},

Khushbu aur Sujeet ki shaadi me apna pyaar, blessings aur presence dene ke liye dil se dhanyavaad.

Aapki duaen hamesha hamare saath rahengi.

With love,
Khushbu & Sujeet`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#3D1C00">
        <h2 style="color:#8B1A1A">Thank you, ${guestName}</h2>
        <p>Khushbu aur Sujeet ki shaadi me apna pyaar, blessings aur presence dene ke liye dil se dhanyavaad.</p>
        <p>Aapki duaen hamesha hamare saath rahengi.</p>
        <p style="margin-top:24px;color:#8B6914">With love,<br>Khushbu &amp; Sujeet</p>
      </div>
    `
  };
}

function createTransporter() {
  return nodemailer.createTransport({
    host: smtpHost.value(),
    port: Number(smtpPort.value() || 587),
    secure: Number(smtpPort.value()) === 465,
    auth: {
      user: smtpUser.value(),
      pass: smtpPass.value()
    }
  });
}

exports.sendWeddingThankYouEmails = onSchedule(
  {
    schedule: 'every day 01:00',
    timeZone: 'Asia/Kolkata',
    secrets: [smtpHost, smtpPort, smtpUser, smtpPass, mailFrom]
  },
  async () => {
    if (Date.now() < WEDDING_FINISHED_AT_IST.getTime()) return;

    const db = admin.firestore();
    const snapshot = await db.collection('weddingRsvps')
      .where('thankYouEmailSent', '==', false)
      .limit(100)
      .get();

    if (snapshot.empty) return;

    const transporter = createTransporter();

    for (const doc of snapshot.docs) {
      const rsvp = doc.data();
      if (!rsvp.email) continue;

      const email = buildThankYouEmail(rsvp.name);
      await transporter.sendMail({
        from: mailFrom.value(),
        to: rsvp.email,
        subject: email.subject,
        text: email.text,
        html: email.html
      });

      await doc.ref.update({
        thankYouEmailSent: true,
        thankYouEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }
);
