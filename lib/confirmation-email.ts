// email-templates/service-agreement-accepted.ts
export function serviceAgreementAcceptedEmailHtml(opts?: {
    customerName?: string;
    agreementId?: string;
    startDate?: string; // pass preformatted (e.g. 01/10/2025)
    endDate?: string;   // pass preformatted (e.g. 30/09/2027)
  }) {
    const {
      customerName = "there",
      agreementId,
      startDate,
      endDate,
    } = opts || {};
  
    return `<!doctype html>
  <html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Service Agreement Accepted</title>
    <style>
      /* Basic email-safe resets */
      body { margin:0; padding:0; background:#f5f7fa; color:#1f2937; }
      table { border-collapse:collapse; }
      a { color:#0ea5e9; text-decoration:none; }
      @media (prefers-color-scheme: dark) {
        body { background:#0b0f14; color:#e5e7eb; }
      }
    </style>
  </head>
  <body>
    <table role="presentation" width="100%" style="background:#f5f7fa; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:640px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);">
            <tr>
              <td style="padding:20px 24px; background:#111827;">
                <div style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji'; font-size:18px; font-weight:600; color:#ffffff;">
                  Elephants Foot Service &amp; Care
                </div>
                <div style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:12px; color:#cbd5e1; margin-top:4px;">
                  Service Agreement Confirmation
                </div>
              </td>
            </tr>
  
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 12px; font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:16px;">
                  Hi ${customerName},
                </p>
                <p style="margin:0 0 12px; font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:16px; line-height:1.6;">
                  Thank you for submitting your Service Agreement with <strong>Elephants Foot Service &amp; Care</strong>.
                  We’re excited to partner with you to keep your building safe, compliant, and fresh.
                </p>
                <p style="margin:0 0 16px; font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:16px; line-height:1.6;">
                  We’ve attached a <strong>signed PDF</strong> of your agreement for your records.
                  Please review it at your convenience and keep it on file.
                </p>
  
                ${
                  agreementId || (startDate && endDate)
                    ? `
                <table role="presentation" width="100%" style="margin:12px 0 16px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;">
                  <tr>
                    <td style="padding:16px;">
                      <div style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:14px; color:#374151; margin-bottom:8px; font-weight:600;">
                        Agreement Details
                      </div>
                      <table role="presentation" width="100%">
                        ${
                          agreementId
                            ? `
                        <tr>
                          <td style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:14px; color:#6b7280; padding:4px 0; width:160px;">Agreement ID</td>
                          <td style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:14px; color:#111827; padding:4px 0;">${agreementId}</td>
                        </tr>`
                            : ""
                        }
                        ${
                          startDate && endDate
                            ? `
                        <tr>
                          <td style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:14px; color:#6b7280; padding:4px 0; width:160px;">Start Date</td>
                          <td style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:14px; color:#111827; padding:4px 0;">${startDate}</td>
                        </tr>
                        <tr>
                          <td style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:14px; color:#6b7280; padding:4px 0; width:160px;">End Date</td>
                          <td style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:14px; color:#111827; padding:4px 0;">${endDate}</td>
                        </tr>`
                            : ""
                        }
                      </table>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }
  
                <p style="margin:0 0 12px; font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:16px; line-height:1.6;">
                  <strong>What happens next?</strong><br />
                  Our team will schedule your services based on the agreement and be in touch with any
                  next steps. If you have questions, simply reply to this email—we’re here to help.
                </p>
  
                <p style="margin:16px 0 0; font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:16px; line-height:1.6;">
                  Thanks again for choosing Elephants Foot Service &amp; Care.
                </p>
  
                <p style="margin:8px 0 0; font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:16px;">
                  Warm regards,<br />
                  <strong>Elephants Foot Service &amp; Care</strong>
                </p>
  
                <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
  
                <p style="margin:0; font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:12px; color:#6b7280; line-height:1.6;">
                  This is a confirmation that your service agreement has been accepted.
                  Please refer to the attached signed PDF for full terms and conditions.
                </p>
              </td>
            </tr>
  
            <tr>
              <td style="background:#f9fafb; padding:16px 24px;">
                <div style="font-family:ui-sans-serif, 'Segoe UI', Roboto, Helvetica, Arial; font-size:12px; color:#6b7280;">
                  &copy; ${new Date().getFullYear()} Elephants Foot Service &amp; Care. All rights reserved.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
  }
  