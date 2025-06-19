import { NextRequest, NextResponse } from "next/server";

// This route just redirects the user to the home page (or dashboard) after OAuth
export async function GET(request: NextRequest) {
  // You can customize this to redirect to a different page if needed
  return NextResponse.redirect(new URL("/", request.url));
}