export default async (req) => {
  try {
    const { payload } = await req.json();
    const formName = payload.form_name;
    const data = payload.data || {};
    const to = 'beachbutlershhi@gmail.com';

    if (formName === 'booking') {
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
        `\n--- Chair Selection ---`,
        `Adult Chairs: ${data['adult-chairs'] || '0'}`,
        `Kids Chairs: ${data['kids-chairs'] || '0'}`,
        `\n--- Add-Ons ---`,
        `Items: ${data['add-ons'] || 'None'}`,
        `Add-Ons Total: ${data['add-ons-total'] || '$0'}`,
      ].join('\n');

      console.log(`Booking notification for ${to} — ${subject}`);
      console.log(body);
      return new Response('OK');
    }

    if (formName === 'inquiry') {
      const subject = `New Beach Butler Inquiry from ${data['name'] || 'Guest'}`;
      const body = [
        `New inquiry received!\n`,
        `Name: ${data['name'] || 'N/A'}`,
        `Email: ${data['email'] || 'N/A'}`,
        `Rental Address: ${data['address'] || 'N/A'}`,
        `Stay Dates: ${data['dates'] || 'N/A'}`,
        `Guests: ${data['guests'] || 'N/A'}`,
      ].join('\n');

      console.log(`Inquiry notification for ${to} — ${subject}`);
      console.log(body);
      return new Response('OK');
    }

    return new Response('OK');
  } catch (err) {
    console.error('Error processing submission:', err);
    return new Response('Error', { status: 500 });
  }
};
