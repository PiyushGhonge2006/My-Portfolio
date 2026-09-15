// Standalone email test that uses the exact same code path as the contact form,
// without needing MongoDB. Run with:  npm run test-email
// It sends a real test email to CONTACT_EMAIL using the Gmail App Password
// in server/.env (EMAIL_FROM / EMAIL_PASS).

import 'dotenv/config'
import { sendContactEmail } from '../controllers/contactController.js'

async function main() {
  if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASS) {
    console.error('✖ EMAIL_FROM and EMAIL_PASS are not set in server/.env')
    console.error('  1) Enable 2-Step Verification: myaccount.google.com/security')
    console.error('  2) Create an App Password:      myaccount.google.com/apppasswords')
    console.error('  3) Paste it into server/.env as EMAIL_PASS=xxxx')
    process.exit(1)
  }

  try {
    await sendContactEmail({
      name: 'Email Test',
      email: 'tester@example.com',
      subject: 'SMTP setup test',
      message: 'This is a test email from the portfolio contact form setup.',
    })
    console.log(`✔ Test email sent to ${process.env.CONTACT_EMAIL || process.env.EMAIL_FROM}`)
    console.log('Check your inbox (and spam folder) for the message.')
  } catch (err) {
    console.error('✖ Failed to send test email:', err.message)
    process.exit(1)
  }
}

main()