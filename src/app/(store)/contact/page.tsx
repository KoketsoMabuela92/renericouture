import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Contact Us</h1>
        <p className="text-neutral-500 max-w-md mx-auto">
          We&apos;d love to hear from you. Get in touch and we&apos;ll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
              <p className="text-sm text-neutral-500">hello@renericouture.com</p>
              <p className="text-sm text-neutral-500">support@renericouture.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Phone</h3>
              <p className="text-sm text-neutral-500">+27 11 000 0000</p>
              <p className="text-sm text-neutral-500">Mon - Fri, 9am - 5pm SAST</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Visit Us</h3>
              <p className="text-sm text-neutral-500">44 Stanley Avenue, Milpark</p>
              <p className="text-sm text-neutral-500">Johannesburg, 2092</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Business Hours</h3>
              <p className="text-sm text-neutral-500">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-sm text-neutral-500">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-sm text-neutral-500">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-neutral-50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">First Name</label>
                <Input placeholder="Your first name" />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Last Name</label>
                <Input placeholder="Your last name" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Email</label>
              <Input type="email" placeholder="your@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Subject</label>
              <Input placeholder="How can we help?" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Message</label>
              <textarea
                className="flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 min-h-[120px]"
                placeholder="Tell us more about your inquiry..."
              />
            </div>
            <Button className="w-full rounded-lg">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
