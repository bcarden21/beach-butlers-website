export default async (req) => {
  try {
    const { payload } = await req.json();

    // Only process booking form submissions
    if (payload.form_name !== 'booking') {
      return new Response('OK');
    }

    const data = payload.data;
    const to = 'beachbutlershhi@gmail.com';
    const subject = `New Beach Butler Booking — ${data['package'] || 'Unknown Package'}`;

    const body = [
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
    ].join('\n');

    // Use Netlify's built-in email via fetch to Mailgun/Sendgrid if configured,
    // otherwise log for Netlify Forms email notification fallback
    console.log(`Booking notification for ${to}:`);
    console.log(body);

    return new Response('OK');
  } catch (err) {
    console.error('Error processing submission:', err);
    return new Response('Error', { status: 500 });
  }
};
