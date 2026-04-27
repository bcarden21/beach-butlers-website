# beach-butlers-website

Beach Butlers HHI website code.

## Booking & contact email delivery

Booking modal submissions and the contact form are captured by **Netlify Forms** (forms named `booking` and `contact`). The `netlify/functions/submission-created.mjs` function fires on each submission and emails the details to **beachbutlershhi@gmail.com**.

To enable outbound email delivery, set the following environment variable in the Netlify project (Site configuration → Environment variables):

- `RESEND_API_KEY` — API key from [resend.com](https://resend.com) (free tier covers 3,000 emails/month).
- `BOOKING_FROM_EMAIL` *(optional)* — verified sender address, e.g. `Beach Butlers <bookings@beachbutlershhi.com>`. Defaults to Resend's shared `onboarding@resend.dev` sender if unset.

Without `RESEND_API_KEY`, submissions are still stored in the Netlify Forms dashboard and the function logs the would-be email to the function logs.

As an alternative (or in addition), Netlify's built-in form notification emails can be configured in the UI:
**Site configuration → Notifications → Form submission notifications → Add notification → Email** and enter `beachbutlershhi@gmail.com`.
