import { Truck, RotateCcw, Clock, MapPin } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-neutral-900 mb-3 text-center">Shipping & Returns</h1>
      <p className="text-neutral-500 text-center mb-14 max-w-md mx-auto">
        Everything you need to know about getting your order to you.
      </p>

      <div className="space-y-12">
        {/* Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-emerald-50 rounded-2xl p-8">
            <Truck className="h-8 w-8 text-emerald-600 mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Shipping Policy</h2>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-start gap-2"><span className="font-semibold text-emerald-600 mt-0.5">•</span> Free shipping on orders over R1,500</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-emerald-600 mt-0.5">•</span> Standard shipping: R150 (3-5 business days)</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-emerald-600 mt-0.5">•</span> Express shipping: R250 (1-2 business days)</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-emerald-600 mt-0.5">•</span> International shipping available to select countries</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-emerald-600 mt-0.5">•</span> All orders include tracking information</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-2xl p-8">
            <RotateCcw className="h-8 w-8 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Returns Policy</h2>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-start gap-2"><span className="font-semibold text-purple-600 mt-0.5">•</span> 30-day return window from delivery date</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-purple-600 mt-0.5">•</span> Items must be unworn with original tags</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-purple-600 mt-0.5">•</span> Free returns on all SA orders</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-purple-600 mt-0.5">•</span> Refunds processed within 5-7 business days</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-purple-600 mt-0.5">•</span> Exchange or store credit also available</li>
            </ul>
          </div>
        </div>

        {/* Delivery Times */}
        <div className="bg-neutral-50 rounded-2xl p-8">
          <Clock className="h-8 w-8 text-neutral-600 mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Estimated Delivery Times</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 font-medium text-neutral-500">Region</th>
                  <th className="text-left py-3 font-medium text-neutral-500">Standard</th>
                  <th className="text-left py-3 font-medium text-neutral-500">Express</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100"><td className="py-3">Gauteng</td><td className="py-3">2-3 days</td><td className="py-3">Next day</td></tr>
                <tr className="border-b border-neutral-100"><td className="py-3">Western Cape</td><td className="py-3">3-4 days</td><td className="py-3">1-2 days</td></tr>
                <tr className="border-b border-neutral-100"><td className="py-3">KZN & Eastern Cape</td><td className="py-3">3-5 days</td><td className="py-3">1-2 days</td></tr>
                <tr className="border-b border-neutral-100"><td className="py-3">Other Provinces</td><td className="py-3">4-6 days</td><td className="py-3">2-3 days</td></tr>
                <tr><td className="py-3">International</td><td className="py-3">7-14 days</td><td className="py-3">3-5 days</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="bg-neutral-50 rounded-2xl p-8">
          <MapPin className="h-8 w-8 text-neutral-600 mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Courier Partners</h2>
          <p className="text-sm text-neutral-600 mb-4">We work with trusted courier partners to ensure safe and timely delivery of your orders.</p>
          <div className="flex flex-wrap gap-3">
            {["Aramex", "DHL", "The Courier Guy", "Fastway", "DSV"].map((c) => (
              <span key={c} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-neutral-700 border border-neutral-200">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
