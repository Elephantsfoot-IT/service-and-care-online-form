import { NextResponse } from "next/server";
import { supabase } from "@/lib/service-aggreement-supabase";

import { Resend } from "resend";
import { serviceAgreementAcceptedEmailHtml } from "@/lib/confirmation-email";
import { ausYMD } from "@/lib/utils";
import { ServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { convertHtmlToPdfLambda } from "@/lib/api";

const resend = new Resend(process.env.RESEND_API_KEY);
const allowedEmails = [
  "steven.trinh@elephantsfoot.com.au",
  "nitesh.singh@elephantsfoot.com.au",
  "triffon.loizides@elephantsfoot.com.au",
  "digital@elephantsfoot.com.au",
  "service@elephantsfoot.com.au",
];
type AcceptBody = {
  id: string;
  state: ServiceAgreementStore; // <-- typed here
};

export async function POST(req: Request) {
  const { id, state } = (await req.json()) as AcceptBody;

  const pdf = await convertHtmlToPdfLambda(state);

  if (allowedEmails.includes(state.accountEmail)) {
    await resend.emails.send({
      to: state.accountEmail, // Recipient email
      replyTo: process.env.REPLY_TO!,
      from: process.env.EMAIL_FROM!,
      subject: "Service Agreement Accepted", // Hardcoded subject
      html: serviceAgreementAcceptedEmailHtml(),
      attachments: [
        {
          filename: "service-agreement.pdf",
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
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json("success", { status: 200 });
}
