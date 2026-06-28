import { Ruler } from "lucide-react";

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <Ruler className="h-10 w-10 mx-auto text-neutral-400 mb-4" />
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Size Guide</h1>
        <p className="text-neutral-500 max-w-md mx-auto">
          Find your perfect fit with our comprehensive size charts.
        </p>
      </div>

      <div className="space-y-12">
        {/* Women's sizes */}
        <div className="bg-neutral-50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Women&apos;s Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 font-medium text-neutral-500">Size</th>
                  <th className="text-center py-3 font-medium text-neutral-500">Bust (cm)</th>
                  <th className="text-center py-3 font-medium text-neutral-500">Waist (cm)</th>
                  <th className="text-center py-3 font-medium text-neutral-500">Hips (cm)</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700 text-center">
                <tr className="border-b border-neutral-100"><td className="text-left py-3 font-medium">XS</td><td className="py-3">80-84</td><td className="py-3">60-64</td><td className="py-3">86-90</td></tr>
                <tr className="border-b border-neutral-100"><td className="text-left py-3 font-medium">S</td><td className="py-3">84-88</td><td className="py-3">64-68</td><td className="py-3">90-94</td></tr>
                <tr className="border-b border-neutral-100"><td className="text-left py-3 font-medium">M</td><td className="py-3">88-92</td><td className="py-3">68-72</td><td className="py-3">94-98</td></tr>
                <tr className="border-b border-neutral-100"><td className="text-left py-3 font-medium">L</td><td className="py-3">92-96</td><td className="py-3">72-76</td><td className="py-3">98-102</td></tr>
                <tr><td className="text-left py-3 font-medium">XL</td><td className="py-3">96-100</td><td className="py-3">76-80</td><td className="py-3">102-106</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Men's sizes */}
        <div className="bg-neutral-50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Men&apos;s Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 font-medium text-neutral-500">Size</th>
                  <th className="text-center py-3 font-medium text-neutral-500">Chest (cm)</th>
                  <th className="text-center py-3 font-medium text-neutral-500">Waist (cm)</th>
                  <th className="text-center py-3 font-medium text-neutral-500">Hips (cm)</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700 text-center">
                <tr className="border-b border-neutral-100"><td className="text-left py-3 font-medium">S</td><td className="py-3">92-96</td><td className="py-3">76-80</td><td className="py-3">92-96</td></tr>
                <tr className="border-b border-neutral-100"><td className="text-left py-3 font-medium">M</td><td className="py-3">96-100</td><td className="py-3">80-84</td><td className="py-3">96-100</td></tr>
                <tr className="border-b border-neutral-100"><td className="text-left py-3 font-medium">L</td><td className="py-3">100-104</td><td className="py-3">84-88</td><td className="py-3">100-104</td></tr>
                <tr className="border-b border-neutral-100"><td className="text-left py-3 font-medium">XL</td><td className="py-3">104-108</td><td className="py-3">88-92</td><td className="py-3">104-108</td></tr>
                <tr><td className="text-left py-3 font-medium">XXL</td><td className="py-3">108-112</td><td className="py-3">92-96</td><td className="py-3">108-112</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center p-8 bg-amber-50 rounded-2xl">
          <p className="text-sm text-amber-800 font-medium">💡 Tip: If you&apos;re between sizes, we recommend sizing up for a more relaxed fit.</p>
          <p className="text-xs text-amber-600 mt-2">Need help? Contact us at support@renericouture.com</p>
        </div>
      </div>
    </div>
  );
}
