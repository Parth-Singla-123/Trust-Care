// app/api/schedule-appointment/route.ts
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  
  const response = await fetch("http://127.0.0.1:5328/api/scheduleappointment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  return NextResponse.json(result);
}
