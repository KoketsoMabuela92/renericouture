import { Newspaper } from "lucide-react";

export default function PressPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <Newspaper className="h-10 w-10 mx-auto text-neutral-400 mb-4" />
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Press</h1>
        <p className="text-neutral-500 max-w-md mx-auto">Media coverage, press releases, and brand assets.</p>
      </div>

      <div className="space-y-6 mb-12">
        {[
          { date: "March 2025", title: "Renéri Couture Featured in Vogue South Africa", source: "Vogue SA", excerpt: "The emerging luxury brand making waves with their commitment to sustainable African fashion." },
          { date: "January 2025", title: "Top 10 African Fashion Brands to Watch", source: "Business Day", excerpt: "Renéri Couture named among the continent's most promising luxury fashion houses." },
          { date: "November 2024", title: "Sustainable Luxury: The Renéri Story", source: "ELLE Magazine", excerpt: "How one Johannesburg brand is proving that luxury and sustainability can coexist." },
        ].map((article) => (
          <div key={article.title} className="bg-neutral-50 rounded-xl p-6 hover:bg-neutral-100 transition-colors">
            <p className="text-xs text-neutral-500 mb-2">{article.date} — {article.source}</p>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">{article.title}</h3>
            <p className="text-sm text-neutral-600">{article.excerpt}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 rounded-2xl p-8 text-center">
        <p className="text-white font-semibold mb-2">Press Inquiries</p>
        <p className="text-neutral-400 text-sm mb-4">For media requests, interviews, and brand assets:</p>
        <p className="text-white font-medium">press@renericouture.com</p>
      </div>
    </div>
  );
}
