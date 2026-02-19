import { getOrderById, getOrdersByEmail } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const orderId = request.nextUrl.searchParams.get("orderId");

  if (orderId) {
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  if (!email) {
    return NextResponse.json({ orders: [] });
  }

  const orders = await getOrdersByEmail(email);
  return NextResponse.json({ orders });
}
