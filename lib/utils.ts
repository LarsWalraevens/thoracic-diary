import { type ClassValue, clsx } from "clsx"
import { NextRequest, NextResponse } from "next/server";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function catchUserAuth(request: NextRequest) {
  if (!request.cookies.get("userSecret") || (request.cookies.get("userSecret")!.value !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD && request.cookies.get("userSecret")!.value !== process.env.NEXT_PUBLIC_USER_PASSWORD)) {
    return NextResponse.json({ message: "Access denied", status: 403 }, { status: 403 });
  }
}

export async function catchAdminAuth(request: NextRequest) {
  if (!request.cookies.get("userSecret") || (request.cookies.get("userSecret")!.value !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD)) {
    return NextResponse.json({ message: "Access denied", status: 403 }, { status: 403 });
  }
}