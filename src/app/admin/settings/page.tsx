"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, CreditCard, Truck, Bell, Shield, Database, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    storeName: "Renéri Couture",
    storeUrl: "https://renericouture.com",
    contactEmail: "hello@renericouture.com",
    phone: "+27 11 000 0000",
    paymentProvider: "Stripe",
    defaultShippingRate: "150",
    freeShippingThreshold: "1500",
    courierIntegration: "Aramex",
    googleAnalyticsId: "",
    facebookPixelId: "",
    s3Bucket: "",
    cloudfrontDistribution: "",
    awsRegion: "af-south-1",
    rdsInstance: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (section: string, fields: Partial<typeof settings>) => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (res.ok) {
      setSaved(section);
      setTimeout(() => setSaved(null), 2500);
    }
  };

  const SaveButton = ({ section, fields }: { section: string; fields: Partial<typeof settings> }) => (
    <Button size="sm" onClick={() => handleSave(section, fields)} className="gap-2">
      {saved === section ? <><CheckCircle className="h-3 w-3" /> Saved</> : "Save Changes"}
    </Button>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Configure your store settings</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* General */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-neutral-500" />
              <div>
                <CardTitle className="text-base">General</CardTitle>
                <CardDescription>Basic store information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Store Name</label>
                <Input value={settings.storeName} onChange={(e) => setSettings((s) => ({ ...s, storeName: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Store URL</label>
                <Input value={settings.storeUrl} onChange={(e) => setSettings((s) => ({ ...s, storeUrl: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Contact Email</label>
                <Input value={settings.contactEmail} onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Phone</label>
                <Input value={settings.phone} onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))} />
              </div>
            </div>
            <SaveButton section="general" fields={{ storeName: settings.storeName, storeUrl: settings.storeUrl, contactEmail: settings.contactEmail, phone: settings.phone }} />
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-neutral-500" />
              <div>
                <CardTitle className="text-base">Payment Gateway</CardTitle>
                <CardDescription>Configure payment processing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                  Payment Provider
                </label>
                <select className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm" value={settings.paymentProvider} onChange={(e) => setSettings((s) => ({ ...s, paymentProvider: e.target.value }))}>
                  <option>Stripe</option>
                  <option>PayGate</option>
                  <option>Paystack</option>
                  <option>PayFast</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                  API Key
                </label>
                <Input type="password" placeholder="sk_live_..." />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                  Secret Key
                </label>
                <Input type="password" placeholder="sk_secret_..." />
              </div>
            </div>
            <SaveButton section="payment" fields={{ paymentProvider: settings.paymentProvider }} />
          </CardContent>
        </Card>

        {/* Shipping */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-neutral-500" />
              <div>
                <CardTitle className="text-base">Shipping & Courier</CardTitle>
                <CardDescription>Configure shipping options</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Default Shipping Rate</label>
                <Input type="number" value={settings.defaultShippingRate} onChange={(e) => setSettings((s) => ({ ...s, defaultShippingRate: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Free Shipping Threshold</label>
                <Input type="number" value={settings.freeShippingThreshold} onChange={(e) => setSettings((s) => ({ ...s, freeShippingThreshold: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Courier Integration</label>
                <select className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm" value={settings.courierIntegration} onChange={(e) => setSettings((s) => ({ ...s, courierIntegration: e.target.value }))}>
                  <option>Aramex</option>
                  <option>DHL</option>
                  <option>The Courier Guy</option>
                  <option>Fastway</option>
                  <option>DSV</option>
                </select>
              </div>
            </div>
            <SaveButton section="shipping" fields={{ defaultShippingRate: settings.defaultShippingRate, freeShippingThreshold: settings.freeShippingThreshold, courierIntegration: settings.courierIntegration }} />
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-neutral-500" />
              <div>
                <CardTitle className="text-base">Integrations</CardTitle>
                <CardDescription>Third-party services</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Google Analytics ID</label>
                <Input placeholder="G-XXXXXXXXXX" value={settings.googleAnalyticsId} onChange={(e) => setSettings((s) => ({ ...s, googleAnalyticsId: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Facebook Pixel ID</label>
                <Input placeholder="Pixel ID" value={settings.facebookPixelId} onChange={(e) => setSettings((s) => ({ ...s, facebookPixelId: e.target.value }))} />
              </div>
            </div>
            <SaveButton section="integrations" fields={{ googleAnalyticsId: settings.googleAnalyticsId, facebookPixelId: settings.facebookPixelId }} />
          </CardContent>
        </Card>

        {/* AWS */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-neutral-500" />
              <div>
                <CardTitle className="text-base">AWS Configuration</CardTitle>
                <CardDescription>Cloud hosting settings for AWS deployment</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">S3 Bucket (Images)</label>
                <Input placeholder="reneri-couture-assets" value={settings.s3Bucket} onChange={(e) => setSettings((s) => ({ ...s, s3Bucket: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">CloudFront Distribution</label>
                <Input placeholder="E1234567890" value={settings.cloudfrontDistribution} onChange={(e) => setSettings((s) => ({ ...s, cloudfrontDistribution: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">AWS Region</label>
                <select className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm" value={settings.awsRegion} onChange={(e) => setSettings((s) => ({ ...s, awsRegion: e.target.value }))}>
                  <option value="af-south-1">Africa (Cape Town)</option>
                  <option value="eu-west-1">Europe (Ireland)</option>
                  <option value="us-east-1">US East (N. Virginia)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">RDS Instance</label>
                <Input placeholder="reneri-db.xxxxx.af-south-1.rds.amazonaws.com" value={settings.rdsInstance} onChange={(e) => setSettings((s) => ({ ...s, rdsInstance: e.target.value }))} />
              </div>
            </div>
            <SaveButton section="aws" fields={{ s3Bucket: settings.s3Bucket, cloudfrontDistribution: settings.cloudfrontDistribution, awsRegion: settings.awsRegion, rdsInstance: settings.rdsInstance }} />
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-neutral-500" />
              <div>
                <CardTitle className="text-base">Security</CardTitle>
                <CardDescription>SSL and security settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-emerald-900">SSL Certificate Active</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Your store is secured with HTTPS via AWS Certificate Manager
                </p>
              </div>
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
