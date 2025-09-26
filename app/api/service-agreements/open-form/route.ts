import { supabase } from "@/lib/service-aggreement-supabase";
import { ausYMD } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const updatedYMD = ausYMD(new Date());
  const { data, error } = await supabase
    .from("service_agreements")
    .update({ status: "Opened", updated_at: updatedYMD, opened_at: updatedYMD })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: logError } = await supabase.from("log").insert({
    created_at: updatedYMD,
    service_agreement_id: id,
    type: "opened",
    title: "Form Opened by Customer",
    description: "",
    author: "System",
  });

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
