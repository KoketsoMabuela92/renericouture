import Link from "next/link";

const footerLinks = {
  Shop: [
    { name: "New Arrivals", href: "/shop?category=new-arrivals" },
    { name: "Women", href: "/shop?category=women" },
    { name: "Men", href: "/shop?category=men" },
    { name: "Accessories", href: "/shop?category=accessories" },
  ],
  "Client Services": [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "FAQ", href: "/faq" },
    { name: "Track Order", href: "/track-order" },
  ],
  Maison: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Sustainability", href: "/sustainability" },
  ],
};

export default function StoreFooter() {
  return (
    <footer className="bg-white border-t border-neutral-200 text-black">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <p className="font-[family-name:var(--font-serif)] text-2xl font-medium tracking-[0.1em] uppercase text-black mb-6">
              Renéri Couture
            </p>
            <p className="text-xs font-light text-neutral-500 leading-loose max-w-xs mb-8">
              Contemporary fashion with timeless elegance. Crafted for those who appreciate quality,
              sustainability, and sophisticated design.
            </p>
            <div className="flex gap-6">
              {["Instagram", "Facebook", "Pinterest"].map((s) => (
                <a key={s} href="#" className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400 hover:text-black transition-colors duration-200">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-[10px] uppercase tracking-[0.25em] font-light text-black mb-6">
                {title}
              </p>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs font-light text-neutral-500 hover:text-black transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400">
            &copy; {new Date().getFullYear()} Renéri Couture. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400 hover:text-black transition-colors duration-200">
              Privacy
            </Link>
            <Link href="/terms" className="text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400 hover:text-black transition-colors duration-200">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
