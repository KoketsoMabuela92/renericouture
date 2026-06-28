import { HelpCircle } from "lucide-react";

const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days within South Africa. Express shipping takes 1-2 business days. International orders typically arrive within 7-14 business days." },
  { q: "What is your return policy?", a: "We offer a 30-day return policy from the date of delivery. Items must be unworn, unwashed, and have all original tags attached. Returns are free for all South African orders." },
  { q: "How do I track my order?", a: "Once your order is shipped, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the orders section." },
  { q: "Do you offer gift wrapping?", a: "Yes! We offer complimentary gift wrapping on all orders. Simply select the gift wrap option at checkout and include a personalized message." },
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, and EFT payments. All transactions are processed securely through our encrypted payment gateway." },
  { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placement. After this window, the order enters our fulfillment process. Please contact us immediately if you need changes." },
  { q: "Do you ship internationally?", a: "Yes, we ship to select countries including the UK, US, Australia, and other EU countries. International shipping rates are calculated at checkout." },
  { q: "How do I care for my garments?", a: "Each item comes with specific care instructions on the label. Generally, we recommend gentle washing or dry cleaning for silk and wool items. Store in a cool, dry place away from direct sunlight." },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <HelpCircle className="h-10 w-10 mx-auto text-neutral-400 mb-4" />
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Frequently Asked Questions</h1>
        <p className="text-neutral-500">Quick answers to common questions</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-neutral-50 rounded-xl p-6 cursor-pointer hover:bg-neutral-100 transition-colors">
            <summary className="flex items-center justify-between font-semibold text-neutral-900 list-none">
              {faq.q}
              <span className="ml-4 text-neutral-400 group-open:rotate-45 transition-transform text-xl">+</span>
            </summary>
            <p className="mt-4 text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>

      <div className="text-center mt-12 p-8 bg-neutral-900 rounded-2xl">
        <p className="text-white font-semibold mb-2">Still have questions?</p>
        <p className="text-neutral-400 text-sm mb-4">Our team is here to help.</p>
        <a href="/contact" className="inline-flex items-center px-6 py-2.5 bg-white text-neutral-900 rounded-full text-sm font-medium hover:bg-neutral-100 transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  );
}
