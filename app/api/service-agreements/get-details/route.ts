
import { supabase } from "@/lib/service-aggreement-supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();
  try {
    const { data, error } = await supabase
      .from("service_agreements")
      .select("*")
      .eq("id", id)
     .not("status", "in", '("Expired","Voided","Accepted")') 
      .single();
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error("No data found");
    }
    return NextResponse.json(data, { status: 200 });
    // Add your logic here
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
