import { randomUUID } from "crypto";
import type {
  Product,
  InsertProduct,
  Category,
  CartItem,
  InsertCartItem,
  WishlistItem,
  InsertWishlistItem,
  Order,
  InsertOrder,
  Address,
  InsertAddress,
  OrderStatus,
} from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  
  getCategories(): Promise<Category[]>;
  
  getCartItems(userId: string): Promise<CartItem[]>;
  getCartItem(id: string): Promise<CartItem | undefined>;
  createCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<void>;
  
  getWishlistItems(userId: string): Promise<WishlistItem[]>;
  getWishlistItem(id: string): Promise<WishlistItem | undefined>;
  createWishlistItem(item: InsertWishlistItem): Promise<WishlistItem>;
  deleteWishlistItem(id: string): Promise<boolean>;
  
  getOrders(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined>;
  
  getAddresses(userId: string): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private cartItems: Map<string, CartItem>;
  private wishlistItems: Map<string, WishlistItem>;
  private orders: Map<string, Order>;
  private addresses: Map<string, Address>;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.wishlistItems = new Map();
    this.orders = new Map();
    this.addresses = new Map();
    this.seedData();

    // Optionally seed from Fakestore API in the background
    // Set SEED_FAKESTORE=true to enable
    if (process.env.SEED_FAKESTORE === "true") {
      // Fire-and-forget; seeding will merge into in-memory data
      // without blocking server startup
      this.seedFromFakestore().catch((err) => {
        // Non-fatal: keep local seed if remote fails
        console.error("Fakestore seeding failed:", err);
      });
    }
  }

  private seedData() {
    const categories: Category[] = [
      { id: "1", name: "Electronics", slug: "electronics" },
      { id: "2", name: "Fashion", slug: "fashion" },
      { id: "3", name: "Home & Kitchen", slug: "home-kitchen" },
      { id: "4", name: "Books", slug: "books" },
      { id: "5", name: "Sports", slug: "sports" },
    ];

    categories.forEach((cat) => this.categories.set(cat.id, cat));

    const products: Product[] = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        description: "Premium noise-cancelling headphones with 30-hour battery life",
        price: 2999,
        originalPrice: 4999,
        categoryId: "1",
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        rating: 4.5,
        reviewCount: 234,
      },
      {
        id: "2",
        name: "Smart Watch Series 7",
        description: "Advanced fitness tracking with heart rate monitor and GPS",
        price: 12999,
        originalPrice: 15999,
        categoryId: "1",
        stock: 8,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        rating: 4.8,
        reviewCount: 456,
      },
      {
        id: "3",
        name: "Premium Laptop Backpack",
        description: "Water-resistant backpack with padded laptop compartment",
        price: 1499,
        originalPrice: 2499,
        categoryId: "2",
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        rating: 4.3,
        reviewCount: 128,
      },
      {
        id: "4",
        name: "Wireless Gaming Mouse",
        description: "RGB gaming mouse with 16000 DPI and customizable buttons",
        price: 1899,
        categoryId: "1",
        stock: 0,
        imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
        rating: 4.6,
        reviewCount: 89,
      },
      {
        id: "5",
        name: "Cotton Casual T-Shirt",
        description: "100% premium cotton, comfortable fit for everyday wear",
        price: 599,
        originalPrice: 999,
        categoryId: "2",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        rating: 4.2,
        reviewCount: 312,
      },
      {
        id: "6",
        name: "Stainless Steel Water Bottle",
        description: "Insulated bottle keeps drinks cold for 24 hours, hot for 12 hours",
        price: 799,
        categoryId: "3",
        stock: 35,
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
        rating: 4.7,
        reviewCount: 178,
      },
      {
        id: "7",
        name: "Mechanical Keyboard RGB",
        description: "Cherry MX switches with customizable RGB lighting",
        price: 4999,
        originalPrice: 6999,
        categoryId: "1",
        stock: 12,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
        rating: 4.9,
        reviewCount: 267,
      },
      {
        id: "8",
        name: "Running Shoes Pro",
        description: "Lightweight running shoes with advanced cushioning technology",
        price: 3999,
        originalPrice: 5999,
        categoryId: "5",
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        rating: 4.4,
        reviewCount: 543,
      },
      {
        id: "9",
        name: "Yoga Mat Premium",
        description: "Non-slip eco-friendly yoga mat with carrying strap",
        price: 1299,
        categoryId: "5",
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
        rating: 4.5,
        reviewCount: 198,
      },
      {
        id: "10",
        name: "Cookbook Collection",
        description: "Complete collection of Indian and international recipes",
        price: 899,
        categoryId: "4",
        stock: 18,
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
        rating: 4.6,
        reviewCount: 92,
      },
      {
        id: "11",
        name: "Coffee Maker Deluxe",
        description: "Programmable coffee maker with thermal carafe",
        price: 5999,
        originalPrice: 7999,
        categoryId: "3",
        stock: 10,
        imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500",
        rating: 4.3,
        reviewCount: 145,
      },
      {
        id: "12",
        name: "Wireless Earbuds Pro",
        description: "True wireless earbuds with active noise cancellation",
        price: 3499,
        originalPrice: 4999,
        categoryId: "1",
        stock: 22,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
        rating: 4.7,
        reviewCount: 421,
      },
      {
        id: "13",
        name: "Designer Sunglasses",
        description: "UV protection polarized lenses with premium frame",
        price: 2499,
        categoryId: "2",
        stock: 0,
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
        rating: 4.4,
        reviewCount: 167,
      },
      {
        id: "14",
        name: "Portable Power Bank 20000mAh",
        description: "Fast charging power bank with dual USB ports",
        price: 1799,
        originalPrice: 2499,
        categoryId: "1",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
        rating: 4.6,
        reviewCount: 289,
      },
      {
        id: "15",
        name: "Air Fryer 4L",
        description: "Healthy cooking with 360° air circulation technology",
        price: 4499,
        categoryId: "3",
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833d62?w=500",
        rating: 4.8,
        reviewCount: 356,
      },
      {
        id: "16",
        name: "Denim Jacket Classic",
        description: "Timeless denim jacket with comfortable fit",
        price: 2999,
        originalPrice: 3999,
        categoryId: "2",
        stock: 28,
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
        rating: 4.5,
        reviewCount: 234,
      },
    ];

    products.forEach((product) => this.products.set(product.id, product));
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updated = { ...product, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter((item) => item.userId === userId);
  }

  async getCartItem(id: string): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async createCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    const existing = Array.from(this.cartItems.values()).find(
      (item) => item.userId === insertItem.userId && item.productId === insertItem.productId
    );

    if (existing) {
      existing.quantity += insertItem.quantity;
      this.cartItems.set(existing.id, existing);
      return existing;
    }

    const id = randomUUID();
    const item: CartItem = { ...insertItem, id };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async deleteCartItem(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    const userCartItems = Array.from(this.cartItems.entries()).filter(
      ([, item]) => item.userId === userId
    );
    userCartItems.forEach(([id]) => this.cartItems.delete(id));
  }

  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter((item) => item.userId === userId);
  }

  async getWishlistItem(id: string): Promise<WishlistItem | undefined> {
    return this.wishlistItems.get(id);
  }

  async createWishlistItem(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const id = randomUUID();
    const item: WishlistItem = { ...insertItem, id };
    this.wishlistItems.set(id, item);
    return item;
  }

  async deleteWishlistItem(id: string): Promise<boolean> {
    return this.wishlistItems.delete(id);
  }

  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((order) => order.userId === userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: "On Process",
      createdAt: new Date().toISOString(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (!order) return undefined;

    order.status = status;
    this.orders.set(orderId, order);
    return order;
  }

  async getAddresses(userId: string): Promise<Address[]> {
    return Array.from(this.addresses.values()).filter((addr) => addr.userId === userId);
  }

  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = randomUUID();
    const address: Address = { ...insertAddress, id };
    this.addresses.set(id, address);
    return address;
  }
}

export const storage = new MemStorage();

// Helper utilities (kept module-local)
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type FakeStoreProduct = {
  id: number;
  title: string;
  price: number; // USD
  description: string;
  category: string;
  image: string;
  rating?: { rate?: number; count?: number };
};

declare global {
  // Ensure TypeScript knows about fetch in Node 20+
  // eslint-disable-next-line @typescript-eslint/no-namespace
  var fetch: typeof globalThis.fetch;
}

// Extend MemStorage with Fakestore seeding capability
// We attach to prototype to keep class definition concise above
MemStorage.prototype.seedFromFakestore = async function seedFromFakestore(this: MemStorage) {
  const baseUrl = process.env.FAKESTORE_API_URL || "https://fakestoreapi.com";

  // Fetch categories
  const categoriesRes = await fetch(`${baseUrl}/products/categories`);
  if (!categoriesRes.ok) throw new Error(`Failed to fetch categories: ${categoriesRes.status}`);
  const categoryNames = (await categoriesRes.json()) as string[];

  // Insert categories if missing
  const existingCategorySlugs = new Set(Array.from(this.categories.values()).map((c) => c.slug));
  for (const name of categoryNames) {
    const slug = slugify(name);
    if (existingCategorySlugs.has(slug)) continue;
    const id = `${this.categories.size + 1}-${slug}`;
    const category: Category = { id, name, slug };
    this.categories.set(id, category);
  }

  // Build a reverse lookup from slug to id
  const slugToCategoryId = new Map<string, string>();
  for (const category of this.categories.values()) {
    slugToCategoryId.set(category.slug, category.id);
  }

  // Fetch products
  const productsRes = await fetch(`${baseUrl}/products`);
  if (!productsRes.ok) throw new Error(`Failed to fetch products: ${productsRes.status}`);
  const fakeProducts = (await productsRes.json()) as FakeStoreProduct[];

  // Insert/merge products
  for (const fp of fakeProducts) {
    const categorySlug = slugify(fp.category);
    const categoryId = slugToCategoryId.get(categorySlug);
    if (!categoryId) continue; // Skip products with unknown category

    const rupeePrice = Math.max(99, Math.round(fp.price * 100)); // approx convert to INR format
    const originalPrice = Math.round(rupeePrice * 1.2);
    const stockFromCount = fp.rating?.count ?? 0;
    // Create a stable stock between 0-50 with some zeros
    const stock = (stockFromCount % 7 === 0) ? 0 : Math.max(0, (stockFromCount % 50));

    const product: Product = {
      id: `fs-${fp.id}`,
      name: fp.title,
      description: fp.description,
      price: rupeePrice,
      originalPrice,
      categoryId,
      stock,
      imageUrl: fp.image,
      rating: fp.rating?.rate ?? 0,
      reviewCount: fp.rating?.count ?? 0,
    };

    this.products.set(product.id, product);
  }
};
