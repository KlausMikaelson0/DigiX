import { seedCategories, seedProducts } from "@/lib/seed-data";
import { getSupabaseClient } from "@/lib/supabase";
import { Category, MarketplaceUser, Order, PaymentProvider, Product } from "@/lib/types";

interface MemoryState {
  categories: Category[];
  products: Product[];
  users: MarketplaceUser[];
  orders: Order[];
}

declare global {
  // eslint-disable-next-line no-var
  var __vanguardMemory: MemoryState | undefined;
}

const memory: MemoryState =
  globalThis.__vanguardMemory ??
  (globalThis.__vanguardMemory = {
    categories: [...seedCategories],
    products: [...seedProducts],
    users: [],
    orders: []
  });

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description),
    accent: String(row.accent),
    created_at: row.created_at ? String(row.created_at) : undefined
  };
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    category_id: String(row.category_id),
    category_slug: String(row.category_slug),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    price_sar: Number(row.price_sar),
    download_link: String(row.download_link),
    image_url: String(row.image_url),
    featured: Boolean(row.featured),
    created_at: row.created_at ? String(row.created_at) : undefined
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    buyer_email: String(row.buyer_email),
    product_id: String(row.product_id),
    amount_sar: Number(row.amount_sar),
    payment_provider: (row.payment_provider as PaymentProvider) ?? "stripe_sim",
    payment_reference: String(row.payment_reference),
    status: (row.status as Order["status"]) ?? "paid",
    download_link: String(row.download_link),
    created_at: String(row.created_at)
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (!error && data && data.length > 0) {
      return data.map((row) => mapCategory(row));
    }
  }
  return memory.categories;
}

interface ProductQuery {
  categorySlug?: string;
  limit?: number;
  featuredOnly?: boolean;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const { categorySlug, limit, featuredOnly } = query;
  const supabase = getSupabaseClient();

  if (supabase) {
    let request = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (categorySlug) request = request.eq("category_slug", categorySlug);
    if (featuredOnly) request = request.eq("featured", true);
    if (limit) request = request.limit(limit);
    const { data, error } = await request;
    if (!error && data) {
      return data.map((row) => mapProduct(row));
    }
  }

  let items = [...memory.products];
  if (categorySlug) {
    items = items.filter((product) => product.category_slug === categorySlug);
  }
  if (featuredOnly) {
    items = items.filter((product) => product.featured);
  }
  if (limit) {
    items = items.slice(0, limit);
  }
  return items;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
    if (!error && data) {
      return mapProduct(data);
    }
  }

  return memory.products.find((item) => item.slug === slug) ?? null;
}

async function upsertBuyer(email: string, fullName: string): Promise<MarketplaceUser> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const payload = {
      email: email.toLowerCase(),
      full_name: fullName,
      role: "buyer"
    };
    const { data, error } = await supabase.from("users").upsert(payload, { onConflict: "email" }).select("*").single();
    if (!error && data) {
      return {
        id: String(data.id),
        email: String(data.email),
        full_name: String(data.full_name),
        role: "buyer",
        created_at: data.created_at ? String(data.created_at) : undefined
      };
    }
  }

  const existing = memory.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return existing;
  }
  const created: MarketplaceUser = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    full_name: fullName,
    role: "buyer",
    created_at: new Date().toISOString()
  };
  memory.users.push(created);
  return created;
}

export interface CheckoutInput {
  productSlug: string;
  fullName: string;
  email: string;
  provider?: PaymentProvider;
}

export interface OrderWithProduct extends Order {
  product?: Product;
}

export async function createPaidOrder(input: CheckoutInput): Promise<OrderWithProduct> {
  const product = await getProductBySlug(input.productSlug);
  if (!product) {
    throw new Error("Product not found");
  }

  const user = await upsertBuyer(input.email, input.fullName);
  const paymentReference = `SIM-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const provider = input.provider ?? "stripe_sim";
  const payload = {
    user_id: user.id,
    buyer_email: user.email,
    product_id: product.id,
    amount_sar: product.price_sar,
    payment_provider: provider,
    payment_reference: paymentReference,
    status: "paid",
    download_link: product.download_link
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("orders").insert(payload).select("*").single();
    if (!error && data) {
      return {
        ...mapOrder(data),
        product
      };
    }
  }

  const created: OrderWithProduct = {
    id: crypto.randomUUID(),
    user_id: user.id,
    buyer_email: user.email,
    product_id: product.id,
    amount_sar: product.price_sar,
    payment_provider: provider,
    payment_reference: paymentReference,
    status: "paid",
    download_link: product.download_link,
    created_at: new Date().toISOString(),
    product
  };
  memory.orders.unshift(created);
  return created;
}

function hydrateOrdersWithProducts(items: Order[]): OrderWithProduct[] {
  return items.map((order) => ({
    ...order,
    product: memory.products.find((product) => product.id === order.product_id)
  }));
}

export async function getOrdersByEmail(email: string): Promise<OrderWithProduct[]> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return [];
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("buyer_email", cleanEmail)
      .order("created_at", { ascending: false });
    if (!error && data) {
      const rows = data.map((row) => mapOrder(row));
      const products = await getProducts();
      return rows.map((order) => ({
        ...order,
        product: products.find((product) => product.id === order.product_id)
      }));
    }
  }

  return hydrateOrdersWithProducts(memory.orders.filter((order) => order.buyer_email === cleanEmail));
}

export async function getOrderById(orderId: string): Promise<OrderWithProduct | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
    if (!error && data) {
      const order = mapOrder(data);
      const product = await getProducts().then((products) => products.find((item) => item.id === order.product_id));
      return { ...order, product };
    }
  }

  const order = memory.orders.find((entry) => entry.id === orderId);
  if (!order) return null;
  return {
    ...order,
    product: memory.products.find((product) => product.id === order.product_id)
  };
}

interface CreateProductInput {
  title: string;
  categorySlug: string;
  description: string;
  priceSar: number;
  imageUrl: string;
  downloadLink: string;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const category = memory.categories.find((item) => item.slug === input.categorySlug) ?? seedCategories[0];
  const slug = slugify(input.title);
  const payload = {
    category_id: category.id,
    category_slug: category.slug,
    slug,
    title: input.title,
    description: input.description,
    price_sar: input.priceSar,
    image_url: input.imageUrl,
    download_link: input.downloadLink,
    featured: false
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("products").insert(payload).select("*").single();
    if (!error && data) {
      return mapProduct(data);
    }
  }

  const created: Product = {
    id: crypto.randomUUID(),
    ...payload,
    created_at: new Date().toISOString()
  };
  memory.products.unshift(created);
  return created;
}

export async function setProductFeatured(productId: string, featured: boolean): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from("products").update({ featured }).eq("id", productId);
  }

  const index = memory.products.findIndex((product) => product.id === productId);
  if (index >= 0) {
    memory.products[index] = {
      ...memory.products[index],
      featured
    };
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from("products").delete().eq("id", productId);
  }

  memory.products = memory.products.filter((product) => product.id !== productId);
}

export interface AdminSnapshot {
  totalRevenueSar: number;
  totalOrders: number;
  totalProducts: number;
  conversionRate: number;
  recentOrders: OrderWithProduct[];
  topProducts: Array<{ title: string; units: number; revenue: number }>;
  chart: Array<{ label: string; revenue: number }>;
}

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const products = await getProducts();
  const orders = (await getAllOrders()).map((order) => ({
    ...order,
    product: products.find((product) => product.id === order.product_id)
  }));

  const totalRevenueSar = orders.reduce((sum, order) => sum + order.amount_sar, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const conversionRate = totalProducts === 0 ? 0 : Number(((totalOrders / (totalProducts * 6)) * 100).toFixed(2));

  const productAgg = new Map<string, { title: string; units: number; revenue: number }>();
  for (const order of orders) {
    const title = order.product?.title ?? "Unknown";
    const current = productAgg.get(order.product_id) ?? { title, units: 0, revenue: 0 };
    current.units += 1;
    current.revenue += order.amount_sar;
    productAgg.set(order.product_id, current);
  }

  const topProducts = [...productAgg.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6);

  const chartMap = new Map<string, number>();
  const labels = Array.from({ length: 7 }, (_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - idx));
    return date.toISOString().slice(0, 10);
  });
  labels.forEach((label) => chartMap.set(label, 0));

  for (const order of orders) {
    const day = order.created_at.slice(0, 10);
    if (chartMap.has(day)) {
      chartMap.set(day, (chartMap.get(day) ?? 0) + order.amount_sar);
    }
  }

  const chart = labels.map((label) => ({
    label: label.slice(5),
    revenue: chartMap.get(label) ?? 0
  }));

  return {
    totalRevenueSar,
    totalOrders,
    totalProducts,
    conversionRate,
    recentOrders: orders.slice(0, 8),
    topProducts,
    chart
  };
}

export async function getAllOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((row) => mapOrder(row));
    }
  }
  return [...memory.orders];
}
