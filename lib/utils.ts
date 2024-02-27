import { type ClassValue, clsx } from "clsx"
import { NextRequest, NextResponse } from "next/server";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function isUserAuth(request: NextRequest): Promise<boolean> {
  if (!request.cookies.get("userSecret") || (request.cookies.get("userSecret")!.value !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD && request.cookies.get("userSecret")!.value !== process.env.NEXT_PUBLIC_USER_PASSWORD)) {
    return false;
  } else return true;
}

export async function isAdminAuth(request: NextRequest): Promise<boolean> {
  if (!request.cookies.get("userSecret") || (request.cookies.get("userSecret")!.value !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD)) {
    return false;
  } else return true;
}

export async function sendAccessDenied() {
  return NextResponse.json({ message: "Access denied", status: 403 }, { status: 403 });
}