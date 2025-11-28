import { ServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { serviceAgreementAcceptedEmailHtml } from "@/lib/confirmation-email";
import { supabase } from "@/lib/service-aggreement-supabase";
import { ausDate, ausYMD } from "@/lib/utils";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const allowedEmails = [
  "steven.trinh@elephantsfoot.com.au",
  "nitesh.singh@elephantsfoot.com.au",
  "triffon.loizides@elephantsfoot.com.au",
  "digital@elephantsfoot.com.au",
  "service@elephantsfoot.com.au",
  "laura.harrison@elephantsfoot.com.au",
  "ea@elephantsfoot.com.au",
  "julian.saidi@elephantsfoot.com.au",
];
type AcceptBody = {
  id: string;
  state: ServiceAgreementStore; // <-- typed here
};

export async function POST(req: Request) {
  const { id, state } = (await req.json()) as AcceptBody;

  const baseUrl =process.env.INTERNAL_BASE_URL!;
  const pdfRes = await fetch(`${baseUrl}/api/generate-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data:state }),
  });
  if (!pdfRes.ok) throw new Error("PDF generation failed");
  const { result: pdf } = await pdfRes.json();

  if (allowedEmails.includes(state.accountEmail)) {
    await resend.emails.send({
      to: state.accountEmail, // Recipient email
      replyTo: process.env.REPLY_TO!,
      from: process.env.EMAIL_FROM!,
      subject: "Service Agreement Accepted", // Hardcoded subject
      html: serviceAgreementAcceptedEmailHtml(),
      attachments: [
        {
          filename: "Elephants-Foot-Service-Agreement.pdf",
          path: pdf,
        },
      ],
    });
  }

  const { error } = await supabase
    .from("service_agreements")
    .update({
      status: "Accepted",
      updated_at: ausYMD(new Date()),
      accepted_at: ausYMD(new Date()),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: logData, error: logError } = await supabase
    .from("log")
    .insert({
      created_at: ausYMD(new Date()),
      service_agreement_id: id,
      type: "accepted",
      title: "Service Agreement Accepted by Customer",
      description: `Service Agreement Signed by ${state.signFullName} at ${ausDate(
        new Date()
      )}`,
      author: "System",
    })
    .select("id") // tell Supabase to return the id column
    .single(); // we know it’s only one row

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 });
  }

  if (logData.id) {
    const { error: signatureError } = await supabase.from("signature").insert({
      created_at: ausYMD(new Date()),
      full_name: state.signFullName,
      title: state.signTitle,
      signature: state.trimmedDataURL,
      log_id: logData.id,
      service_agreement_id: id,
    });

    if (signatureError) {
      return NextResponse.json(
        { error: signatureError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json("success", { status: 200 });
}
