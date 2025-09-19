
import { SimproCustomer } from "@/lib/interface";
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

    let customers = null as SimproCustomer | null;
    if(data.simpro_customer_id){
      const response = await fetch(
        `${process.env.SIMPRO_API_URL}/companies/0/customers/companies/${data.simpro_customer_id}?columns=ID,CompanyName,EIN,Address,Phone,Email`,
        {
          headers: {
            Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      customers = await response.json();
    }
    return NextResponse.json({...data, simpro_customer: customers}, { status: 200 });
    // Add your logic here
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
