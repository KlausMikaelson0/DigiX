import { getCategories, getProducts } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category") ?? undefined;
  const featured = params.get("featured") === "true";
  const limit = params.get("limit");
  const parsedLimit = limit ? Number(limit) : undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: category,
      featuredOnly: featured,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined
    })
  ]);

  return NextResponse.json({ categories, products });
}
