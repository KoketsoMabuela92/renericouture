import nodemailer from "nodemailer";
import { Order } from "./types";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "email-smtp.af-south-1.amazonaws.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
}

const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || "https://renericouture.com";

export async function sendOrderConfirmation(order: Order): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP not configured — skipping order confirmation email");
    return;
  }

  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${item.name} (${item.size}, ${item.color})</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#fafafa;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #eee;">
    <div style="background:#111;padding:32px 40px;">
      <h1 style="color:#fff;font-size:22px;font-weight:300;letter-spacing:0.1em;margin:0;">RENÉRI COUTURE</h1>
    </div>
    <div style="padding:40px;">
      <h2 style="font-size:20px;font-weight:600;color:#111;margin:0 0 8px;">Order Confirmed</h2>
      <p style="color:#666;font-size:14px;margin:0 0 24px;">
        Thank you, ${order.customerName}. Your order has been received and is being processed.
      </p>

      <div style="background:#f9f9f9;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Order Reference</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111;font-family:monospace;">#${order.id.slice(-8).toUpperCase()}</p>
        <a href="${STORE_URL}/track-order?id=${order.id}"
           style="display:inline-block;margin-top:12px;background:#111;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">
          Track Your Order →
        </a>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:2px solid #111;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#666;">Item</th>
            <th style="text-align:center;padding:8px 0;border-bottom:2px solid #111;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#666;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:2px solid #111;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#666;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div style="margin-top:16px;text-align:right;font-size:14px;">
        <p style="margin:4px 0;color:#666;">Subtotal: ${formatCurrency(order.subtotal)}</p>
        <p style="margin:4px 0;color:#666;">Shipping: ${order.shippingCost === 0 ? "Free" : formatCurrency(order.shippingCost)}</p>
        <p style="margin:4px 0;color:#666;">VAT (15%): ${formatCurrency(order.tax)}</p>
        <p style="margin:8px 0 0;font-size:16px;font-weight:700;color:#111;">Total: ${formatCurrency(order.total)}</p>
      </div>

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

      <h3 style="font-size:13px;font-weight:600;color:#111;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.06em;">Shipping Address</h3>
      <p style="font-size:14px;color:#666;margin:0;line-height:1.6;">
        ${order.shippingAddress.street}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.postalCode}<br>
        ${order.shippingAddress.country}
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="font-size:13px;color:#666;margin:0 0 4px;">We&apos;ll send you a shipping update once your order is dispatched.</p>
      <p style="font-size:12px;color:#aaa;margin:0;">
        Questions? Email <a href="mailto:hello@renericouture.com" style="color:#111;">hello@renericouture.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Renéri Couture" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: order.customerEmail,
    subject: `Order Confirmed — #${order.id.slice(-8).toUpperCase()}`,
    html,
  });
}
