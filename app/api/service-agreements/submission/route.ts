import { NextResponse } from "next/server";
import { supabase } from "@/lib/service-aggreement-supabase";

export async function POST(req: Request) {
    const { id } = await req.json();
    const { data, error } = await supabase.from("service_agreements").update({
        status: "Accepted"
    }).eq("id", id).select().single();
    if(error){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
}