import { Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const openings = [
  { title: "Senior Fashion Designer", dept: "Design", location: "Johannesburg", type: "Full-time" },
  { title: "E-commerce Manager", dept: "Digital", location: "Johannesburg", type: "Full-time" },
  { title: "Visual Merchandiser", dept: "Retail", location: "Cape Town", type: "Full-time" },
  { title: "Social Media Coordinator", dept: "Marketing", location: "Remote", type: "Part-time" },
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <Briefcase className="h-10 w-10 mx-auto text-neutral-400 mb-4" />
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Careers</h1>
        <p className="text-neutral-500 max-w-md mx-auto">
          Join our team and help shape the future of African luxury fashion.
        </p>
      </div>

      <div className="bg-neutral-50 rounded-2xl p-8 mb-10">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Why Renéri Couture?</h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We&apos;re building something special — a brand that combines world-class design with African creativity. We value diversity, innovation, and craftsmanship. If you&apos;re passionate about fashion and want to make an impact, we&apos;d love to hear from you.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Open Positions</h2>
      <div className="space-y-4">
        {openings.map((job) => (
          <div key={job.title} className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-900">{job.title}</h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-neutral-500">{job.dept}</span>
                <span className="text-xs text-neutral-300">•</span>
                <span className="text-xs text-neutral-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                <span className="text-xs text-neutral-300">•</span>
                <span className="text-xs text-neutral-500">{job.type}</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="rounded-full">Apply</Button>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 p-8 bg-neutral-100 rounded-2xl">
        <p className="text-sm text-neutral-600">
          Don&apos;t see a role that fits? Send your CV to <span className="font-semibold">careers@renericouture.com</span>
        </p>
      </div>
    </div>
  );
}
