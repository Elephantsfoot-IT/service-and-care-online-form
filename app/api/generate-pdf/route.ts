import { NextRequest, NextResponse } from "next/server";

const PDF_SERVICE_URL ='https://service-agreement-pdf-railway-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(
      `${PDF_SERVICE_URL}/pdf-generation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PDF service error:", errorText);
      return NextResponse.json(
        { 
          error: "PDF generation failed",
          message: `PDF service returned ${response.status}: ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract and return just the presignedUrl
    if (data?.result?.presignedUrl) {
      return NextResponse.json({ result: data.result.presignedUrl });
    }
    
    throw new Error("Invalid response format from PDF service");
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate PDF",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
