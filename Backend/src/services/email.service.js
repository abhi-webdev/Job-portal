import 'dotenv/config';
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready ✅');
  }
});

export const sendApplicationEmail = async ({
  email,
  name,
  jobTitle,
  company,
  generatedPassword,
}) => {
  const mailOptions = {
    from: `"JobMatch" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: `Application Submitted - ${jobTitle}`,

    html: `
            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <title>
                    Application Submitted
                </title>

            </head>


            <body style="
                margin: 0;
                padding: 0;
                background-color: #f4f4f5;
                font-family: Arial, sans-serif;
            ">

                <div style="
                    max-width: 600px;
                    margin: 40px auto;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e4e4e7;
                ">


                    <!-- Header -->

                    <div style="
                        background-color: #18181b;
                        color: white;
                        padding: 30px;
                        text-align: center;
                    ">

                        <h1 style="
                            margin: 0;
                            font-size: 28px;
                        ">
                            JobMatch
                        </h1>

                        <p style="
                            margin: 8px 0 0;
                            color: #d4d4d8;
                        ">
                            Job Application Portal
                        </p>

                    </div>


                    <!-- Content -->

                    <div style="
                        padding: 35px;
                    ">

                        <h2 style="
                            color: #18181b;
                        ">
                            Application Submitted 🎉
                        </h2>


                        <p style="
                            color: #52525b;
                            font-size: 16px;
                            line-height: 1.6;
                        ">

                            Hi <strong>${name}</strong>,

                        </p>


                        <p style="
                            color: #52525b;
                            font-size: 16px;
                            line-height: 1.6;
                        ">

                            Your application has been successfully
                            submitted. Here are the details:

                        </p>


                        <!-- Job Details -->

                        <div style="
                            background-color: #f4f4f5;
                            border-radius: 10px;
                            padding: 20px;
                            margin: 25px 0;
                        ">

                            <p style="
                                margin: 0 0 10px;
                                color: #71717a;
                                font-size: 13px;
                            ">
                                JOB
                            </p>

                            <h3 style="
                                margin: 0 0 8px;
                                color: #18181b;
                                font-size: 20px;
                            ">
                                ${jobTitle}
                            </h3>

                            <p style="
                                margin: 0;
                                color: #52525b;
                            ">
                                ${company}
                            </p>

                        </div>

                        ${
                          generatedPassword
                            ? `
                        <!-- Account Credentials Box -->
                        <div style="
                            background-color: #f0fdf4;
                            border: 1px solid #bbf7d0;
                            border-radius: 10px;
                            padding: 20px;
                            margin: 25px 0;
                        ">
                            <h3 style="
                                margin: 0 0 8px;
                                color: #166534;
                                font-size: 16px;
                                font-weight: bold;
                            ">
                                🔐 Your Account Login Credentials
                            </h3>
                            <p style="
                                margin: 0 0 12px;
                                color: #15803d;
                                font-size: 14px;
                                line-height: 1.5;
                            ">
                                An account has been created for you. You can use these credentials to log in whenever you return to track your application and respond to interviews or offers.
                            </p>
                            <div style="
                                background-color: #ffffff;
                                border: 1px solid #dcfce7;
                                border-radius: 8px;
                                padding: 14px 16px;
                                margin-bottom: 10px;
                            ">
                                <p style="margin: 0 0 8px; font-size: 14px; color: #374151;">
                                    <strong>Email:</strong> <span style="font-family: monospace; color: #111827; font-size: 14px;">${email}</span>
                                </p>
                                <p style="margin: 0; font-size: 14px; color: #374151;">
                                    <strong>Password:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold; color: #15803d; background: #f0fdf4; padding: 2px 8px; border-radius: 4px; border: 1px dashed #86efac;">${generatedPassword}</span>
                                </p>
                            </div>
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                Please save this password safely. You can also sign in directly using this email and password anytime.
                            </p>
                        </div>
                        `
                            : ''
                        }

                        <p style="
                            color: #52525b;
                            font-size: 15px;
                            line-height: 1.6;
                        ">

                            Our recruitment team will review your
                            application. You can track your application
                            status from your JobMatch dashboard.

                        </p>


                        <div style="
                            text-align: center;
                            margin: 30px 0;
                        ">

                            <a
                                href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-applications"
                                style="
                                    display: inline-block;
                                    padding: 12px 24px;
                                    background-color: #18181b;
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 8px;
                                    font-weight: bold;
                                "
                            >
                                View My Applications
                            </a>

                        </div>


                        <p style="
                            color: #71717a;
                            font-size: 14px;
                            line-height: 1.6;
                        ">

                            Thank you for using JobMatch.

                        </p>


                        <p style="
                            color: #18181b;
                            font-weight: bold;
                        ">
                            JobMatch Team
                        </p>

                    </div>


                    <!-- Footer -->

                    <div style="
                        background-color: #fafafa;
                        padding: 20px;
                        text-align: center;
                        border-top: 1px solid #e4e4e7;
                    ">

                        <p style="
                            margin: 0;
                            color: #a1a1aa;
                            font-size: 12px;
                        ">
                            This is an automated email.
                            Please do not reply.
                        </p>

                    </div>

                </div>

            </body>

            </html>
        `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Email sent successfully:', info.messageId);

  return info;
};

const sendInterviewEmail = async ({
  email,
  name,
  jobTitle,
  company,
  interviewDate,
  interviewTime,
  meetingLink,
  message,
}) => {
  const mailOptions = {
    from: `"Job Portal" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: `Interview Scheduled - ${jobTitle}`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">

        <h2>
          Interview Scheduled 🎉
        </h2>

        <p>
          Hello <strong>${name}</strong>,
        </p>

        <p>
          Your interview has been scheduled for
          <strong>${jobTitle}</strong>
          at
          <strong>${company}</strong>.
        </p>

        <div style="
          background: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        ">

          <p>
            <strong>Job:</strong>
            ${jobTitle}
          </p>

          <p>
            <strong>Company:</strong>
            ${company}
          </p>

          <p>
            <strong>Date:</strong>
            ${interviewDate}
          </p>

          <p>
            <strong>Time:</strong>
            ${interviewTime}
          </p>

          <p>
            <strong>Meeting:</strong>
            <a href="${meetingLink}">
              Join Interview
            </a>
          </p>

        </div>

        ${
          message
            ? `
              <p>
                <strong>Message from recruiter:</strong>
              </p>

              <p>
                ${message}
              </p>
            `
            : ''
        }

        <p>
          Please join the interview a few minutes early.
        </p>

        <p>
          Best regards,<br/>
          Job Portal Team
        </p>

      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Interview email sent:', info.messageId);

  return info;
};

const sendInterviewResultEmail = async ({
  email,
  name,
  jobTitle,
  company,
  result,
  resultMessage,
}) => {
  const subject =
    result === 'Selected'
      ? `Interview Result - Congratulations!`
      : `Interview Result - ${jobTitle}`;

  const html = `
    <div style="font-family: Arial; line-height: 1.6">

      <h2>Hello ${name},</h2>

      <p>
        Your interview result for
        <strong>${jobTitle}</strong>
        at
        <strong>${company}</strong>
        is:
      </p>

      <h2>${result}</h2>

      ${resultMessage ? `<p>${resultMessage}</p>` : ''}

      ${
        result === 'Selected'
          ? `
            <p>
              Congratulations!
              Our team will contact you
              regarding the next steps.
            </p>
          `
          : `
            <p>
              Thank you for taking the time
              to interview with us.
            </p>
          `
      }

    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  });
};



const sendOfferEmail = async ({
  email,
  name,
  jobTitle,
  company,
  position,
  salary,
  joiningDate,
  expiryDate,
  message,
  applicationId,
}) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const applicationUrl = `${frontendUrl}/my-applications/${applicationId}`;
    const acceptUrl = `${frontendUrl}/offer-response/${applicationId}/accept`;
    const rejectUrl = `${frontendUrl}/offer-response/${applicationId}/reject`;

    const mailOptions = {
      from: `"JobMatch" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 Official Job Offer Letter - ${position} at ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Job Offer</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 620px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e4e4e7; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background-color: #09090b; color: white; padding: 36px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 26px; letter-spacing: -0.5px;">🎉 Congratulations, ${name}!</h1>
              <p style="margin: 8px 0 0; color: #a1a1aa; font-size: 15px;">You have received an official Job Offer from ${company}</p>
            </div>
            
            <div style="padding: 32px 28px;">
              <p style="color: #27272a; font-size: 16px; line-height: 1.6; margin-top: 0;">
                We are thrilled to offer you the position of <strong>${position}</strong> at <strong>${company}</strong>!
              </p>

              <div style="background-color: #fafafa; border-radius: 12px; border: 1px solid #e4e4e7; padding: 22px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px; color: #18181b; font-size: 17px; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px;">Offer Summary</h3>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #3f3f46;">
                  <tr>
                    <td style="padding: 7px 0; color: #71717a; width: 150px;">Position:</td>
                    <td style="padding: 7px 0; font-weight: bold; color: #09090b;">${position}</td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; color: #71717a;">Job Role:</td>
                    <td style="padding: 7px 0; font-weight: 600;">${jobTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; color: #71717a;">Company:</td>
                    <td style="padding: 7px 0; font-weight: 600;">${company}</td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; color: #71717a;">Annual Compensation:</td>
                    <td style="padding: 7px 0; font-weight: bold; color: #16a34a; font-size: 16px;">₹${Number(salary).toLocaleString('en-IN')} / year</td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; color: #71717a;">Joining Date:</td>
                    <td style="padding: 7px 0; font-weight: 600;">${new Date(joiningDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; color: #71717a;">Offer Expiry:</td>
                    <td style="padding: 7px 0; font-weight: bold; color: #dc2626;">${new Date(expiryDate).toLocaleDateString()}</td>
                  </tr>
                </table>
              </div>

              ${message ? `
                <div style="background-color: #f4f4f5; padding: 16px; border-radius: 10px; margin-bottom: 24px;">
                  <p style="margin: 0 0 6px; font-weight: bold; color: #52525b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message from Recruiter:</p>
                  <p style="margin: 0; color: #27272a; font-size: 14px; line-height: 1.5;">${message}</p>
                </div>
              ` : ''}

              <!-- Primary Call To Action -->
              <div style="text-align: center; margin: 30px 0 20px;">
                <a href="${applicationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #09090b; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
                  Review & Respond on Portal →
                </a>
              </div>

              <!-- Quick Response Action Links -->
              <div style="text-align: center; margin: 20px 0 10px; padding: 16px; background-color: #fafafa; border-radius: 10px; border: 1px dashed #d4d4d8;">
                <p style="margin: 0 0 12px; font-size: 13px; color: #71717a; font-weight: 500;">Or respond directly:</p>
                <div style="display: inline-flex; gap: 12px;">
                  <a href="${acceptUrl}" style="display: inline-block; padding: 10px 22px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; margin: 0 5px;">
                    ✓ Accept Offer
                  </a>
                  <a href="${rejectUrl}" style="display: inline-block; padding: 10px 22px; background-color: #fee2e2; color: #b91c1c; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; margin: 0 5px; border: 1px solid #fca5a5;">
                    ✕ Decline
                  </a>
                </div>
              </div>

              <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 24px;">
                Please note that this offer expires on <strong>${new Date(expiryDate).toLocaleDateString()}</strong>.
              </p>
            </div>
            
            <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px;">JobMatch Recruitment Engine · Automated Notification</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Offer email sent successfully ✅', info.messageId);
    return info;
  } catch (error) {
    console.error('Offer email error:', error);
    return null;
  }
};

export { sendInterviewEmail, sendInterviewResultEmail, sendOfferEmail };
