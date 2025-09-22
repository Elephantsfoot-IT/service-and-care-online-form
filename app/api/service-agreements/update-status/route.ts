

import { supabase } from "@/lib/service-aggreement-supabase";
import { ausYMD } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true });
}


export async function PUT(request: NextRequest) {
  const { id, status } = await request.json();
  if (!id || !status) {
    return NextResponse.json(
      { error: "Missing id or status" },
      { status: 400 }
    );
  }
  const updatedYMD = ausYMD(new Date());
  const { data, error } = await supabase
    .from("service_agreements")
    .update({ status, updated_at: updatedYMD })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
 
  return NextResponse.json(data);
}
