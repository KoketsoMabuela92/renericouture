import fs from "fs";
import path from "path";
import { Product, Customer, Order, Category, WishlistItem, Event } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, defaultValue: T[]): T[] {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeJsonFile<T>(filename: string, data: T[]) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Products
export function getProducts(): Product[] {
  return readJsonFile<Product>("products.json", seedProducts);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function createProduct(product: Product): Product {
  const products = getProducts();
  products.push(product);
  writeJsonFile("products.json", products);
  return product;
}

export function updateProduct(
  id: string,
  updates: Partial<Product>
): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  writeJsonFile("products.json", products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  writeJsonFile("products.json", filtered);
  return true;
}

// Customers
export function getCustomers(): Customer[] {
  return readJsonFile<Customer>("customers.json", []);
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find((c) => c.id === id);
}

export function getCustomerByEmail(email: string): Customer | undefined {
  return getCustomers().find((c) => c.email === email);
}

export function createCustomer(customer: Customer): Customer {
  const customers = getCustomers();
  customers.push(customer);
  writeJsonFile("customers.json", customers);
  return customer;
}

export function updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return null;
  customers[index] = { ...customers[index], ...updates };
  writeJsonFile("customers.json", customers);
  return customers[index];
}

export function deleteCustomer(id: string): boolean {
  const customers = getCustomers();
  const filtered = customers.filter((c) => c.id !== id);
  if (filtered.length === customers.length) return false;
  writeJsonFile("customers.json", filtered);
  return true;
}

// Orders
export function getOrders(): Order[] {
  return readJsonFile<Order>("orders.json", []);
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  return getOrders().filter((o) => o.customerId === customerId);
}

export function createOrder(order: Order): Order {
  const orders = getOrders();
  orders.push(order);
  writeJsonFile("orders.json", orders);
  return order;
}

export function updateOrder(
  id: string,
  updates: Partial<Order>
): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
  writeJsonFile("orders.json", orders);
  return orders[index];
}

// Categories
export function getCategories(): Category[] {
  return readJsonFile<Category>("categories.json", seedCategories);
}

export function createCategory(category: Category): Category {
  const categories = getCategories();
  categories.push(category);
  writeJsonFile("categories.json", categories);
  return category;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...updates };
  writeJsonFile("categories.json", categories);
  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  writeJsonFile("categories.json", filtered);
  return true;
}

// Seed data
const seedCategories: Category[] = [
  { id: "cat-1", name: "Women", slug: "women", description: "Women's clothing collection" },
  { id: "cat-2", name: "Men", slug: "men", description: "Men's clothing collection" },
  { id: "cat-3", name: "Accessories", slug: "accessories", description: "Fashion accessories" },
  { id: "cat-4", name: "New Arrivals", slug: "new-arrivals", description: "Latest additions" },
];

const seedProducts: Product[] = [
  {
    id: "prod-1",
    name: "Silk Blouse",
    slug: "silk-blouse",
    description: "Luxurious silk blouse with a relaxed fit. Perfect for both casual and formal occasions. Features mother-of-pearl buttons and French seams.",
    price: 1299.99,
    compareAtPrice: 1599.99,
    category: "Women",
    subcategory: "Tops",
    images: ["/images/products/silk-blouse.svg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Black", "Blush"],
    stock: 45,
    sku: "RC-WB-001",
    featured: true,
    active: true,
    tags: ["silk", "blouse", "elegant"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Tailored Wool Blazer",
    slug: "tailored-wool-blazer",
    description: "Impeccably tailored wool blazer with satin lining. A timeless piece that elevates any outfit with its structured shoulders and single-button closure.",
    price: 2499.99,
    compareAtPrice: 2999.99,
    category: "Women",
    subcategory: "Outerwear",
    images: ["/images/products/wool-blazer.svg"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Charcoal", "Navy", "Camel"],
    stock: 30,
    sku: "RC-WO-002",
    featured: true,
    active: true,
    tags: ["blazer", "wool", "tailored"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Cashmere Crew Sweater",
    slug: "cashmere-crew-sweater",
    description: "Ultra-soft cashmere crew neck sweater. Lightweight yet warm, this sweater is crafted from Grade-A Mongolian cashmere with ribbed cuffs and hem.",
    price: 1899.99,
    category: "Men",
    subcategory: "Knitwear",
    images: ["/images/products/cashmere-sweater.svg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey Melange", "Navy", "Burgundy", "Forest Green"],
    stock: 60,
    sku: "RC-MK-003",
    featured: true,
    active: true,
    tags: ["cashmere", "sweater", "luxury"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Linen Trousers",
    slug: "linen-trousers",
    description: "Relaxed-fit linen trousers with a comfortable elastic waistband. Ideal for warm weather, these trousers offer effortless sophistication.",
    price: 999.99,
    compareAtPrice: 1199.99,
    category: "Men",
    subcategory: "Bottoms",
    images: ["/images/products/linen-trousers.svg"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Sand", "White", "Olive"],
    stock: 40,
    sku: "RC-MB-004",
    featured: false,
    active: true,
    tags: ["linen", "trousers", "summer"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    description: "Hand-stitched Italian leather crossbody bag with adjustable strap. Features multiple compartments and gold-tone hardware.",
    price: 3499.99,
    category: "Accessories",
    images: ["/images/products/crossbody-bag.svg"],
    sizes: ["One Size"],
    colors: ["Tan", "Black", "Cognac"],
    stock: 25,
    sku: "RC-AC-005",
    featured: true,
    active: true,
    tags: ["leather", "bag", "accessories"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-6",
    name: "Merino Wool Scarf",
    slug: "merino-wool-scarf",
    description: "Oversized merino wool scarf in a classic check pattern. Incredibly soft and warm, finished with hand-knotted fringe.",
    price: 799.99,
    category: "Accessories",
    images: ["/images/products/wool-scarf.svg"],
    sizes: ["One Size"],
    colors: ["Camel Check", "Grey Check", "Navy Check"],
    stock: 50,
    sku: "RC-AC-006",
    featured: false,
    active: true,
    tags: ["scarf", "wool", "winter"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-7",
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    description: "Elegant pleated midi skirt in flowing crepe fabric. Features a hidden side zip and satin waistband for a polished look.",
    price: 1499.99,
    category: "Women",
    subcategory: "Bottoms",
    images: ["/images/products/pleated-skirt.svg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Emerald", "Dusty Rose"],
    stock: 35,
    sku: "RC-WB-007",
    featured: true,
    active: true,
    tags: ["skirt", "pleated", "elegant"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-8",
    name: "Cotton Oxford Shirt",
    slug: "cotton-oxford-shirt",
    description: "Classic oxford button-down shirt in premium Egyptian cotton. Slightly relaxed fit with a curved hem, perfect for layering.",
    price: 899.99,
    category: "Men",
    subcategory: "Shirts",
    images: ["/images/products/oxford-shirt.svg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink"],
    stock: 55,
    sku: "RC-MS-008",
    featured: false,
    active: true,
    tags: ["shirt", "cotton", "classic"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-9",
    name: "Classic Trench Coat",
    slug: "classic-trench-coat",
    description: "A timeless double-breasted trench coat in water-repellent cotton gabardine. Features epaulettes, a belted waist, and storm flap. The ultimate wardrobe investment.",
    price: 4999.99,
    compareAtPrice: 5999.99,
    category: "New Arrivals",
    subcategory: "Outerwear",
    images: ["/images/products/trench-coat.svg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Camel", "Black", "Stone"],
    stock: 20,
    sku: "RC-NA-009",
    featured: true,
    active: true,
    tags: ["trench", "coat", "outerwear", "new", "classic"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-10",
    name: "Wide Leg Trousers",
    slug: "wide-leg-trousers",
    description: "Fluid wide-leg trousers cut from premium crepe fabric. A sculptural silhouette with a high waist and clean front. Effortlessly elegant for any occasion.",
    price: 1699.99,
    category: "New Arrivals",
    subcategory: "Bottoms",
    images: ["/images/products/wide-leg-pants.svg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ebony", "Ivory", "Taupe"],
    stock: 35,
    sku: "RC-NA-010",
    featured: true,
    active: true,
    tags: ["trousers", "wide leg", "new", "elegant"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-11",
    name: "Silk Wrap Dress",
    slug: "silk-wrap-dress",
    description: "A sinuous silk wrap dress with a deep V-neckline and self-tie waist. Cut on the bias for a flattering, fluid drape. Available in rich, saturated tones.",
    price: 2899.99,
    compareAtPrice: 3299.99,
    category: "New Arrivals",
    subcategory: "Dresses",
    images: ["/images/products/wrap-dress.svg"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Burgundy", "Emerald", "Midnight Blue"],
    stock: 18,
    sku: "RC-NA-011",
    featured: true,
    active: true,
    tags: ["dress", "silk", "wrap", "new", "occasion"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-12",
    name: "Relaxed Linen Shirt",
    slug: "relaxed-linen-shirt",
    description: "An oversized Cuban-collar shirt in stonewashed linen. Beautifully textured with a relaxed silhouette and chest patch pocket. A summer wardrobe essential.",
    price: 1199.99,
    category: "New Arrivals",
    subcategory: "Tops",
    images: ["/images/products/linen-shirt.svg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Ecru", "Sage", "Washed Black"],
    stock: 42,
    sku: "RC-NA-012",
    featured: false,
    active: true,
    tags: ["linen", "shirt", "new", "relaxed", "summer"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-13",
    name: "Structured Leather Tote",
    slug: "structured-leather-tote",
    description: "A refined structured tote in full-grain black leather. Dual rolled handles, interior zip pocket, and reinforced corners. A statement piece built to last a lifetime.",
    price: 5499.99,
    category: "New Arrivals",
    subcategory: "Bags",
    images: ["/images/products/structured-tote.svg"],
    sizes: ["One Size"],
    colors: ["Black"],
    stock: 12,
    sku: "RC-NA-013",
    featured: true,
    active: true,
    tags: ["leather", "tote", "bag", "new", "structured"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Wishlist
export function getWishlist(customerId: string): WishlistItem[] {
  const all = readJsonFile<WishlistItem>("wishlist.json", []);
  return all.filter((w) => w.customerId === customerId);
}

export function addToWishlist(item: WishlistItem): WishlistItem {
  const all = readJsonFile<WishlistItem>("wishlist.json", []);
  const exists = all.find((w) => w.customerId === item.customerId && w.productId === item.productId);
  if (exists) return exists;
  all.push(item);
  writeJsonFile("wishlist.json", all);
  return item;
}

export function removeFromWishlist(customerId: string, productId: string): void {
  const all = readJsonFile<WishlistItem>("wishlist.json", []);
  writeJsonFile("wishlist.json", all.filter((w) => !(w.customerId === customerId && w.productId === productId)));
}

export function syncWishlist(customerId: string, productIds: string[]): void {
  const all = readJsonFile<WishlistItem>("wishlist.json", []);
  const existing = all.filter((w) => w.customerId === customerId).map((w) => w.productId);
  const toAdd = productIds.filter((id) => !existing.includes(id));
  const now = new Date().toISOString();
  toAdd.forEach((productId) => all.push({ id: `${customerId}-${productId}`, customerId, productId, addedAt: now }));
  writeJsonFile("wishlist.json", all);
}

// Events
export function getEvents(): Event[] {
  return readJsonFile<Event>("events.json", []);
}

export function getEventById(id: string): Event | undefined {
  return getEvents().find((e) => e.id === id);
}

export function createEvent(event: Event): Event {
  const events = getEvents();
  events.push(event);
  writeJsonFile("events.json", events);
  return event;
}

export function updateEvent(id: string, updates: Partial<Event>): Event | null {
  const events = getEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
  writeJsonFile("events.json", events);
  return events[index];
}

export function deleteEvent(id: string): boolean {
  const events = getEvents();
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return false;
  writeJsonFile("events.json", filtered);
  return true;
}
