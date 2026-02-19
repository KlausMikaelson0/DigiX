import { createPaidOrder } from "@/lib/store";
import { NextResponse } from "next/server";

interface CheckoutPayload {
  productSlug?: string;
  fullName?: string;
  email?: string;
  provider?: "stripe_sim" | "paddle_sim";
}

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckoutPayload;

  if (!payload.productSlug || !payload.fullName || !payload.email) {
    return NextResponse.json({ error: "Missing checkout fields" }, { status: 400 });
  }

  try {
    const order = await createPaidOrder({
      productSlug: payload.productSlug,
      fullName: payload.fullName,
      email: payload.email,
      provider: payload.provider
    });
    return NextResponse.json({
      orderId: order.id,
      buyerEmail: order.buyer_email,
      successUrl: `/success?order=${order.id}`
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to checkout" }, { status: 500 });
  }
}
