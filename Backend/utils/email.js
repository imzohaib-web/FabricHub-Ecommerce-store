/**
 * Email Utility class to handle email notifications for key events
 * (e.g. registration welcome, email verification, password reset).
 * 
 * To activate live mail sending in production:
 * 1. Install nodemailer: npm install nodemailer
 * 2. Configure SMTP credentials in .env (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS)
 * 3. Uncomment nodemailer transport lines in the send() method below.
 */
class Email {
  /**
   * @param {Object} user - User document containing name and email.
   * @param {string} url - Action URL (e.g. reset password path, verify email path).
   */
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name.split(' ')[0];
    this.url = url;
    this.from = `Fabric Hub <noreply@fabrichub.com>`;
  }

  /**
   * Send a formatted email message (Mock implementation logs to console).
   * @param {string} subject - The subject line of the email.
   * @param {string} textContent - Plain text body of the email.
   */
  async send(subject, textContent) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: textContent
    };

    // Print to console for verification during development/testing
    console.log('\n┌─────────────────── MOCK EMAIL DISPATCHED ──────────────────┐');
    console.log(`│ From:    ${mailOptions.from.padEnd(50)} │`);
    console.log(`│ To:      ${mailOptions.to.padEnd(50)} │`);
    console.log(`│ Subject: ${mailOptions.subject.padEnd(50)} │`);
    console.log('├────────────────────────────────────────────────────────────┤');
    const lines = mailOptions.text.split('\n');
    lines.forEach(line => {
      console.log(`│ ${line.padEnd(58)} │`);
    });
    console.log('└────────────────────────────────────────────────────────────┘\n');

    //NODEMAILER INTEGRATION TEMPLATE:
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail(mailOptions);
  }

  /**
   * Send a verification email containing the verification URL.
   */
  async sendVerification() {
    await this.send(
      'Verify your Fabric Hub email address',
      `Welcome ${this.name}!\n\nPlease verify your email to activate your account.\nClick the link below (expires in 24 hours):\n${this.url}\n\nIf you did not create this account, please ignore this email.`
    );
  }

  /**
   * Send a password reset email containing the password reset URL.
   */
  async sendPasswordReset() {
    await this.send(
      'Your password reset request (Valid for 10 minutes)',
      `Hello ${this.name},\n\nWe received a request to reset your password.\nPlease visit the link below to set a new password:\n${this.url}\n\nIf you did not request this, your password will remain unchanged.`
    );
  }
}

module.exports = Email;
