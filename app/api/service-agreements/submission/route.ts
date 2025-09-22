import { NextResponse } from "next/server";
import { supabase } from "@/lib/service-aggreement-supabase";

import { Resend } from "resend";
import { serviceAgreementAcceptedEmailHtml } from "@/lib/confirmation-email";
import { ausYMD } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { id } = await req.json();

  await resend.emails.send({
    to: "steven.trinh@elephantsfoot.com.au", // Recipient email
    cc: "steven.trinh@enterpriseevolve.com.au",
    replyTo: process.env.REPLY_TO!,
    from: process.env.EMAIL_FROM!,
    subject: "Service Agreement Accepted", // Hardcoded subject
    html: serviceAgreementAcceptedEmailHtml(),
  });

  const { data, error } = await supabase
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
  return NextResponse.json({ data });
}
