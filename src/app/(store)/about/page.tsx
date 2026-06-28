import { Heart, Leaf, Award, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">About Renéri Couture</h1>
        <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
          Born from a passion for timeless elegance and sustainable fashion, Renéri Couture creates contemporary pieces that transcend seasons.
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="bg-neutral-100 rounded-2xl aspect-[4/3] flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-6xl font-bold text-neutral-300 mb-2">RC</p>
            <p className="text-xs uppercase tracking-widest text-neutral-400">Est. 2020</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Story</h2>
          <p className="text-neutral-600 leading-relaxed mb-4">
            Renéri Couture was founded in Johannesburg with a simple vision: to create clothing that makes you feel extraordinary. Every piece in our collection is thoughtfully designed, ethically sourced, and crafted to last.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-4">
            We believe that fashion should be both beautiful and responsible. That&apos;s why we work exclusively with suppliers who share our commitment to fair labor practices and environmental stewardship.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            From our atelier in Johannesburg, we serve customers across South Africa and beyond, bringing world-class fashion with an authentic African perspective.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-10">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: "Craftsmanship", desc: "Every stitch matters. Our garments are crafted with meticulous attention to detail.", color: "text-rose-600", bg: "bg-rose-50" },
            { icon: Leaf, title: "Sustainability", desc: "We use organic, recycled, and responsibly sourced materials wherever possible.", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: Award, title: "Quality", desc: "Premium fabrics and timeless designs that stand the test of time.", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Users, title: "Community", desc: "Supporting local artisans and giving back to the communities that inspire us.", color: "text-blue-600", bg: "bg-blue-50" },
          ].map((v) => (
            <div key={v.title} className="text-center p-6 rounded-2xl bg-white border border-neutral-100">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl ${v.bg} flex items-center justify-center`}>
                <v.icon className={`h-6 w-6 ${v.color}`} />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">{v.title}</h3>
              <p className="text-sm text-neutral-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-neutral-900 rounded-2xl p-12 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { stat: "5,000+", label: "Happy Customers" },
            { stat: "200+", label: "Unique Designs" },
            { stat: "15+", label: "Countries Shipped" },
            { stat: "98%", label: "Satisfaction Rate" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-white mb-1">{s.stat}</p>
              <p className="text-sm text-neutral-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
