import { createProduct, deleteProduct, getProducts, setProductFeatured } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

interface CreatePayload {
  title?: string;
  categorySlug?: string;
  description?: string;
  priceSar?: number;
  imageUrl?: string;
  downloadLink?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as CreatePayload;

  if (
    !payload.title ||
    !payload.categorySlug ||
    !payload.description ||
    typeof payload.priceSar !== "number" ||
    !payload.imageUrl ||
    !payload.downloadLink
  ) {
    return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
  }

  const product = await createProduct({
    title: payload.title,
    categorySlug: payload.categorySlug,
    description: payload.description,
    priceSar: payload.priceSar,
    imageUrl: payload.imageUrl,
    downloadLink: payload.downloadLink
  });

  return NextResponse.json({ product });
}

interface PatchPayload {
  productId?: string;
  featured?: boolean;
}

export async function PATCH(request: Request) {
  const payload = (await request.json()) as PatchPayload;
  if (!payload.productId || typeof payload.featured !== "boolean") {
    return NextResponse.json({ error: "Invalid update payload" }, { status: 400 });
  }

  await setProductFeatured(payload.productId, payload.featured);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }
  await deleteProduct(productId);
  return NextResponse.json({ ok: true });
}
