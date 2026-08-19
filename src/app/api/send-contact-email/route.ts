import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'info@digitalnyne.com';

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Prevent duplicate sends within the same process (in-memory guard)
const sentRefs = new Set<string>();

export async function POST(request: NextRequest) {
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    console.log('[send-contact-email] Resend not configured. Skipping email send.');
    return NextResponse.json({ success: true, emailSent: false });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { refNumber, name, email, phone, subject, message, utmSource, utmMedium, utmCampaign } = body;

  // Validate required fields
  const ref = String(refNumber || '').trim();
  const customerEmail = String(email || '').trim();
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // Duplicate send guard
  const guardKey = ref || `contact-${customerEmail}-${Date.now()}`;
  if (ref && sentRefs.has(ref)) {
    console.log(`[send-contact-email] Duplicate send blocked for ref: ${ref}`);
    return NextResponse.json({ success: true, emailSent: false, duplicate: true });
  }
  if (ref) {
    sentRefs.add(ref);
    setTimeout(() => sentRefs.delete(ref), 10 * 60 * 1000);
  }

  const safeRef = escapeHtml(ref || 'N/A');
  const safeName = escapeHtml(name || '');
  const safeEmail = escapeHtml(customerEmail);
  const safePhone = escapeHtml(phone || 'Not provided');
  const safeSubject = escapeHtml(subject || '');
  const safeMessage = escapeHtml(message || '');
  const safeUtmSource = escapeHtml(utmSource || 'Direct');
  const safeUtmMedium = escapeHtml(utmMedium || 'None');
  const safeUtmCampaign = escapeHtml(utmCampaign || 'None');
  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });

  const customerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Message Received</title></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #0758F9, #00CF75); padding: 32px 40px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 800;">DIGITALNYNE</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Growth Studio</p>
    </div>
    <div style="padding: 40px;">
      <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0 0 8px;">We have received your message!</h2>
      <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
        Hi ${safeName}, thank you for contacting DIGITALNYNE Growth Studio. We have received your message and our team will get back to you shortly.
      </p>
      ${ref ? `
      <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <p style="color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Your Enquiry Reference</p>
        <p style="color: #0758F9; font-size: 24px; font-weight: 800; margin: 0;">${safeRef}</p>
        <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0;">Please save this reference for future communication.</p>
      </div>` : ''}
      <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        If you have any questions, please reply to this email or contact us directly.
      </p>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 8px;">
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">
          Email: <a href="mailto:info@digitalnyne.com" style="color: #0758F9;">info@digitalnyne.com</a><br>
          WhatsApp: <a href="https://wa.me/919398461937" style="color: #25D366;">+91 79952 91377</a><br>
          Website: <a href="https://www.digitalnyne.com" style="color: #0758F9;">www.digitalnyne.com</a>
        </p>
      </div>
    </div>
    <div style="background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">DIGITALNYNE Growth Studio, Visakhapatnam, Andhra Pradesh, India</p>
    </div>
  </div>
</body>
</html>`;

  const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Contact Message</title></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <div style="background: #0f172a; padding: 24px 32px;">
      <h1 style="color: #fff; margin: 0; font-size: 18px; font-weight: 700;">New Contact Message</h1>
      <p style="color: rgba(255,255,255,0.5); margin: 4px 0 0; font-size: 13px;">Reference: ${safeRef}</p>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 35%; vertical-align: top;">Submission Type</td><td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">Contact Form</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Enquiry Reference</td><td style="padding: 8px 0; color: #0758F9; font-size: 13px; font-weight: 700;">${safeRef}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Submitted At</td><td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">${submittedAt} IST</td></tr>
        <tr><td colspan="2" style="padding: 4px 0;"><hr style="border: none; border-top: 1px solid #e2e8f0;"></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Customer Name</td><td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">${safeName}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Customer Email</td><td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;"><a href="mailto:${safeEmail}" style="color: #0758F9;">${safeEmail}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Phone</td><td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">${safePhone}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Subject</td><td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">${safeSubject}</td></tr>
        <tr><td colspan="2" style="padding: 4px 0;"><hr style="border: none; border-top: 1px solid #e2e8f0;"></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">UTM Source</td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${safeUtmSource}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">UTM Medium</td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${safeUtmMedium}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">UTM Campaign</td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${safeUtmCampaign}</td></tr>
      </table>
      <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-top: 16px;">
        <p style="color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Message</p>
        <p style="color: #0f172a; font-size: 13px; line-height: 1.6; margin: 0;">${safeMessage}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  try {
    const [customerRes, adminRes] = await Promise.allSettled([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: [customerEmail],
          reply_to: ['info@digitalnyne.com'],
          subject: `Message Received${ref ? ` (${safeRef})` : ''} | DIGITALNYNE Growth Studio`,
          html: customerHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: [ADMIN_EMAIL],
          reply_to: [customerEmail],
          subject: `New Contact Message from ${safeName}${ref ? ` (${safeRef})` : ''}`,
          html: adminHtml,
        }),
      }),
    ]);

    const customerOk = customerRes.status === 'fulfilled' && customerRes.value.ok;
    const adminOk = adminRes.status === 'fulfilled' && adminRes.value.ok;

    if (!customerOk) {
      const reason = customerRes.status === 'rejected' ? customerRes.reason : await customerRes.value.text().catch(() => 'unknown');
      console.error('[send-contact-email] Customer email failed:', reason);
    }
    if (!adminOk) {
      const reason = adminRes.status === 'rejected' ? adminRes.reason : await adminRes.value.text().catch(() => 'unknown');
      console.error('[send-contact-email] Admin email failed:', reason);
    }

    return NextResponse.json({ success: true, emailSent: customerOk || adminOk });
  } catch (err) {
    console.error('[send-contact-email] Unexpected error:', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ success: true, emailSent: false });
  }
}
