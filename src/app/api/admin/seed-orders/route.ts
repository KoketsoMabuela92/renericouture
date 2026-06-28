import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/db";
import { generateId } from "@/lib/utils";

const demoOrders = [
  {
    customerName: "Naledi Dlamini",
    customerEmail: "naledi.dlamini@email.com",
    status: "delivered" as const,
    paymentStatus: "paid" as const,
    items: [
      { productId: "prod-1", name: "Silk Blouse", price: 1299.99, quantity: 1, size: "S", color: "White", image: "" },
      { productId: "prod-6", name: "Merino Wool Scarf", price: 599.99, quantity: 1, size: "One Size", color: "Camel", image: "" },
    ],
    subtotal: 1899.98, shippingCost: 0, tax: 266.0, total: 2165.98,
    shippingAddress: { street: "14 Sandton Drive", city: "Sandton", province: "Gauteng", postalCode: "2196", country: "South Africa" },
    trackingNumber: "ARX-4521-ZA", courierService: "Aramex",
  },
  {
    customerName: "Thabo Molefe",
    customerEmail: "thabo.m@gmail.com",
    status: "shipped" as const,
    paymentStatus: "paid" as const,
    items: [
      { productId: "prod-9", name: "Classic Trench Coat", price: 4999.99, quantity: 1, size: "M", color: "Camel", image: "" },
    ],
    subtotal: 4999.99, shippingCost: 0, tax: 700.0, total: 5699.99,
    shippingAddress: { street: "8 Kloof Street", city: "Cape Town", province: "Western Cape", postalCode: "8001", country: "South Africa" },
    trackingNumber: "DHL-887234-CT", courierService: "DHL",
  },
  {
    customerName: "Aisha Patel",
    customerEmail: "aisha.patel@outlook.com",
    status: "processing" as const,
    paymentStatus: "paid" as const,
    items: [
      { productId: "prod-11", name: "Silk Wrap Dress", price: 2899.99, quantity: 1, size: "S", color: "Burgundy", image: "" },
      { productId: "prod-5", name: "Leather Crossbody Bag", price: 2499.99, quantity: 1, size: "One Size", color: "Black", image: "" },
    ],
    subtotal: 5399.98, shippingCost: 0, tax: 756.0, total: 6155.98,
    shippingAddress: { street: "22 Umhlanga Rocks Drive", city: "Umhlanga", province: "KwaZulu-Natal", postalCode: "4319", country: "South Africa" },
  },
  {
    customerName: "Sipho Khumalo",
    customerEmail: "sipho.k@icloud.com",
    status: "confirmed" as const,
    paymentStatus: "paid" as const,
    items: [
      { productId: "prod-2", name: "Tailored Wool Blazer", price: 2499.99, quantity: 1, size: "L", color: "Charcoal", image: "" },
      { productId: "prod-4", name: "Linen Trousers", price: 899.99, quantity: 1, size: "L", color: "Beige", image: "" },
    ],
    subtotal: 3399.98, shippingCost: 150, tax: 492.0, total: 4041.98,
    shippingAddress: { street: "5 Rosebank Mall", city: "Johannesburg", province: "Gauteng", postalCode: "2196", country: "South Africa" },
  },
  {
    customerName: "Zanele Mokoena",
    customerEmail: "zanele.mok@webmail.co.za",
    status: "pending" as const,
    paymentStatus: "paid" as const,
    items: [
      { productId: "prod-13", name: "Structured Leather Tote", price: 5499.99, quantity: 1, size: "One Size", color: "Black", image: "" },
    ],
    subtotal: 5499.99, shippingCost: 0, tax: 770.0, total: 6269.99,
    shippingAddress: { street: "32 Menlyn Park", city: "Pretoria", province: "Gauteng", postalCode: "0181", country: "South Africa" },
  },
  {
    customerName: "Kefilwe Sithole",
    customerEmail: "kefilwe.s@gmail.com",
    status: "delivered" as const,
    paymentStatus: "paid" as const,
    items: [
      { productId: "prod-7", name: "Pleated Midi Skirt", price: 1499.99, quantity: 1, size: "M", color: "Dusty Rose", image: "" },
      { productId: "prod-12", name: "Relaxed Linen Shirt", price: 1199.99, quantity: 1, size: "S", color: "Ecru", image: "" },
    ],
    subtotal: 2699.98, shippingCost: 0, tax: 378.0, total: 3077.98,
    shippingAddress: { street: "18 Ballito Bay", city: "Ballito", province: "KwaZulu-Natal", postalCode: "4420", country: "South Africa" },
    trackingNumber: "TCG-99012-KZN", courierService: "The Courier Guy",
  },
];

export async function GET() {
  const existing = getOrders();
  if (existing.length > 0) {
    return NextResponse.json({ message: `Already have ${existing.length} orders — skipping seed` });
  }

  const now = new Date();
  for (let i = 0; i < demoOrders.length; i++) {
    const d = demoOrders[i];
    const createdAt = new Date(now.getTime() - (i * 2 + 1) * 24 * 60 * 60 * 1000).toISOString();
    createOrder({
      id: generateId(),
      customerId: "guest",
      customerEmail: d.customerEmail,
      customerName: d.customerName,
      items: d.items,
      shippingAddress: d.shippingAddress,
      status: d.status,
      paymentStatus: d.paymentStatus,
      subtotal: d.subtotal,
      shippingCost: d.shippingCost,
      tax: d.tax,
      total: d.total,
      trackingNumber: d.trackingNumber,
      courierService: d.courierService,
      createdAt,
      updatedAt: createdAt,
    });
  }

  return NextResponse.json({ message: `Seeded ${demoOrders.length} demo orders` });
}
