// email-templates/service-agreement-accepted.ts
export function serviceAgreementAcceptedEmailHtml(opts?: {
  customerName?: string;
  agreementId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const {
    customerName = "there",
    agreementId,
    startDate,
    endDate,
  } = opts || {};

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Service Agreement Accepted</title>
  </head>
  <body style="background-color:#192542;margin:0;padding:0;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" style="background-color:#192542;padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" style="background-color:#192542;color:white;padding:0 24px;max-width:640px;">
            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:32px;">
                <img width="260" src="http://cdn.mcauto-images-production.sendgrid.net/007b4c94093af38a/ddf001f2-9461-45f4-9220-32acceb4bf46/2515x967.png" alt="Elephants Foot Service & Care" style="display:block;">
              </td>
            </tr>

            <!-- Greeting & intro -->
            <tr>
              <td style="font-size:18px;line-height:1.6;">
                Hi ${customerName},
              </td>
            </tr>
            <tr>
              <td style="padding-top:16px;font-size:16px;line-height:1.6;">
                Thank you for submitting your <strong>Service Agreement</strong> with
                <strong>Elephants Foot Service &amp; Care</strong>.  
                We’re excited to partner with you to keep your building safe, compliant, and fresh.
              </td>
            </tr>
            <tr>
              <td style="padding-top:16px;font-size:16px;line-height:1.6;">
                We’ve attached a signed PDF of your agreement for your records.  
                Please review it at your convenience and keep it on file.
              </td>
            </tr>

            ${
              agreementId || (startDate && endDate)
                ? `
            <tr>
              <td style="padding-top:24px;">
                <table role="presentation" width="100%" style="background:#1e293b;border:1px solid #475569;border-radius:8px;color:white;">
                  <tr>
                    <td style="padding:16px;font-size:14px;">
                      <strong style="font-size:16px;">Agreement Details</strong><br/><br/>
                      ${
                        agreementId
                          ? `<div><span style="color:#94a3b8;">Agreement ID:</span> ${agreementId}</div>`
                          : ""
                      }
                      ${
                        startDate && endDate
                          ? `<div><span style="color:#94a3b8;">Start Date:</span> ${startDate}</div>
                             <div><span style="color:#94a3b8;">End Date:</span> ${endDate}</div>`
                          : ""
                      }
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            `
                : ""
            }

            <tr>
              <td style="padding-top:24px;font-size:16px;line-height:1.6;">
                <strong>What happens next?</strong><br/>
                Our team will schedule your services based on the agreement and be in touch with next steps.
                If you have questions, simply reply to this email—we’re here to help.
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px;font-size:16px;line-height:1.6;">
                Thanks again for choosing <strong>Elephants Foot Service &amp; Care</strong>.
              </td>
            </tr>

            <tr>
              <td style="padding-top:16px;font-size:16px;">
                Warm regards,<br/>
                <strong>Elephants Foot Service &amp; Care</strong>
              </td>
            </tr>

            <tr>
              <td style="padding-top:32px;font-size:12px;color:#94a3b8;line-height:1.6;">
                This is a confirmation that your service agreement has been accepted.
                Please refer to the attached signed PDF for full terms and conditions.
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px;font-size:12px;color:#94a3b8;">
                &copy; ${new Date().getFullYear()} Elephants Foot Service &amp; Care. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
