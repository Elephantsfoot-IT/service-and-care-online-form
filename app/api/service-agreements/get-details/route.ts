import { supabase } from "@/lib/service-aggreement-supabase";
import { formatInTimeZone } from "date-fns-tz";
import { NextResponse } from "next/server";

const TZ = "Australia/Sydney";
export async function POST(req: Request) {
  const { id } = await req.json();
  const auToday = formatInTimeZone(new Date(), TZ, "yyyy-MM-dd");
  try {
    const { data, error } = await supabase
      .from("service_agreements")
      .select("*")
      .eq("id", id)
      .not("status", "in", '("Expired","Voided","Accepted")')
      .gte("expire_at", auToday) // valid if expire_at >= AU today (inclusive)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error("No data found");
    }

    
    return NextResponse.json(
      { ...data},
      { status: 200 }
    );
    // Add your logic here
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
