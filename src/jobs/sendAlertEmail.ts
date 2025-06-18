import { Resend } from 'resend';

const {EMAIL_API_KEY} = process.env;

const resend = new Resend(EMAIL_API_KEY);

resend.emails.send({
  from: 'vacunaterd@resend.dev',
  to: 'wcandelario095@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});