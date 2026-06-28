import { Leaf, Recycle, Globe, Heart } from "lucide-react";

export default function SustainabilityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <Leaf className="h-10 w-10 mx-auto text-emerald-500 mb-4" />
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Sustainability</h1>
        <p className="text-neutral-500 max-w-lg mx-auto">
          Fashion can be beautiful and responsible. Here&apos;s how we&apos;re making a difference.
        </p>
      </div>

      <div className="space-y-8">
        {[
          { icon: Leaf, title: "Sustainable Materials", desc: "We prioritize organic cotton, recycled polyester, TENCEL™ lyocell, and other eco-friendly materials. Our suppliers are certified by GOTS, OEKO-TEX, and the Better Cotton Initiative.", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: Recycle, title: "Circular Fashion", desc: "We design for longevity. Our garments are made to last, and we offer a repair service to extend their life. We're also developing a take-back program to recycle end-of-life items.", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Globe, title: "Carbon Neutral Shipping", desc: "We offset 100% of our shipping emissions through verified carbon offset projects. We also use plastic-free, recyclable packaging made from FSC-certified materials.", color: "text-purple-600", bg: "bg-purple-50" },
          { icon: Heart, title: "Ethical Production", desc: "All our manufacturing partners are regularly audited for fair wages, safe working conditions, and no forced or child labor. We believe in transparency throughout our supply chain.", color: "text-rose-600", bg: "bg-rose-50" },
        ].map((item) => (
          <div key={item.title} className={`${item.bg} rounded-2xl p-8 flex gap-6`}>
            <div className="flex-shrink-0">
              <item.icon className={`h-8 w-8 ${item.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">{item.title}</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center p-8 bg-emerald-900 rounded-2xl">
        <p className="text-white font-semibold text-lg mb-2">Our 2030 Goals</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div><p className="text-2xl font-bold text-emerald-300">100%</p><p className="text-sm text-emerald-100">Sustainable materials</p></div>
          <div><p className="text-2xl font-bold text-emerald-300">Net Zero</p><p className="text-sm text-emerald-100">Carbon emissions</p></div>
          <div><p className="text-2xl font-bold text-emerald-300">Zero</p><p className="text-sm text-emerald-100">Waste to landfill</p></div>
        </div>
      </div>
    </div>
  );
}
