import nodemailer from 'nodemailer';

const isProduction = true; // process.env.NODE_ENV === 'production';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

class Transporter {
  async _createInstance() {
    const options = {
      host: 'smtp-pulse.com',
      port: 2525, //2525 587 465
      secure: false, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    };

    if (!isProduction) {
      // Generate test SMTP service account from ethereal.email
      const testAccount = await nodemailer.createTestAccount();
      options.host = 'smtp.ethereal.email';
      options.auth = { user: testAccount.user, pass: testAccount.pass };
    }
    let poolConfig = `smtps://${SMTP_USER}:${SMTP_PASS}@smtp-pulse.com/`;
    return nodemailer.createTransport(poolConfig);
  }

  /**
   * @param {{
   * to: string
   * from?: string
   * subject: string
   * text?: string
   * html?: string
   * templateId?: string
   * }} options
   * @returns {Promise<void>}
   */
  async send({ to, from, subject, text, html, templateId }) {
    const self = await this._createInstance();
    const info = await self.sendMail({
      to,
      from,
      subject,
      text,
      html,
      templateId,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      // Preview only available when sending through an Ethereal account
      console.log('Email Preview URL: %s', previewUrl);
    }
  }
}

/**
 * @param {{
 * to: string
 * from?: string
 * subject: string
 * text?: string
 * html?: string
 * templateId?: string
 * }} options
 * @returns {Promise<void>}
 */
const mail = ({ to, from, subject, text, html, templateId }) => {
  if (!isProduction) {
    subject = `[${process.env.NODE_ENV || 'DEV'}] ` + subject;
  }

  const mailer = new Transporter();
  return mailer.send({ to, from, subject, text, html, templateId });
};

export default mail;
