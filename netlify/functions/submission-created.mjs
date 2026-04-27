const RECIPIENT = 'beachbutlershhi@gmail.com';

function buildBookingBody(data) {
  return [
    `New booking request received!\n`,
    `Package: ${data['package'] || 'N/A'}`,
    `Price: ${data['price'] || 'N/A'}`,
    `Start Date: ${data['start-date'] || 'N/A'}`,
    `End Date: ${data['end-date'] || 'N/A'}`,
    `\n--- Guest Info ---`,
    `Name: ${data['guest-name'] || 'N/A'}`,
    `Email: ${data['email'] || 'N/A'}`,
    `Phone: ${data['phone'] || 'N/A'}`,
    `\n--- Staying At ---`,
    `Address: ${data['address'] || 'N/A'}`,
    `City: ${data['city'] || 'N/A'}`,
    `State: ${data['state'] || 'N/A'}`,
    `Zip: ${data['zip'] || 'N/A'}`,
    `\n--- Chair Selection ---`,
    `Adult Chairs: ${data['adult-chairs'] || '0'}`,
    `Kids Chairs: ${data['kids-chairs'] || '0'}`,
    `\n--- Add-Ons ---`,
    `Items: ${data['add-ons'] || 'None'}`,
    `Add-Ons Total: ${data['add-ons-total'] || '$0'}`,
  ].join('\n');
}

function buildContactBody(data) {
  return [
    `New contact inquiry received!\n`,
    `Name: ${data['Name'] || data['name'] || 'N/A'}`,
    `Email: ${data['Email'] || data['email'] || 'N/A'}`,
    `Rental Address: ${data['Address'] || data['address'] || 'N/A'}`,
    `Stay Dates: ${data['Dates'] || data['dates'] || 'N/A'}`,
    `Number of Guests: ${data['Guests'] || data['guests'] || 'N/A'}`,
  ].join('\n');
}

async function sendEmail({ subject, body, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[submission-created] RESEND_API_KEY not set — would have emailed ${RECIPIENT}:`);
    console.log(`Subject: ${subject}`);
    console.log(body);
    return { skipped: true };
  }

  const from = process.env.BOOKING_FROM_EMAIL || 'Beach Butlers <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [RECIPIENT],
      subject,
      text: body,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API ${res.status}: ${errText}`);
  }

  return { sent: true };
}

export default async (req) => {
  try {
    const { payload } = await req.json();
    const formName = payload.form_name;
    const data = payload.data || {};

    let subject;
    let body;
    let replyTo;

    if (formName === 'booking') {
      subject = `New Beach Butler Booking — ${data['package'] || 'Unknown Package'}`;
      body = buildBookingBody(data);
      replyTo = data['email'];
    } else if (formName === 'contact') {
      subject = `New Beach Butler Inquiry — ${data['Name'] || data['name'] || 'Website Contact'}`;
      body = buildContactBody(data);
      replyTo = data['Email'] || data['email'];
    } else {
      return new Response('OK');
    }

    await sendEmail({ subject, body, replyTo });
    return new Response('OK');
  } catch (err) {
    console.error('Error processing submission:', err);
    return new Response('Error', { status: 500 });
  }
};
